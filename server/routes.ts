import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import { analyzeReceipt, generateInsights } from "./openai";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  setupAuth(app);

  // Receipts
  app.post(api.receipts.upload.path, upload.single('image'), async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    if (!req.file) return res.status(400).json({ message: "No image provided" });

    try {
      // In a real app, upload to S3/Blob storage. Here we'll use base64 for the OpenAI API
      // and storing a data URI is not ideal for DB but works for MVP/Replit
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const receipt = await storage.createReceipt({
        userId: req.user!.id,
        imageUrl: dataURI, // In prod, this should be a cloud URL
        status: "processing",
        merchantName: "Processing...",
        amount: 0,
      });

      // Process asynchronously (or await if fast enough, gpt-4o is fast)
      // We'll await for better UX in MVP
      const analysis = await analyzeReceipt(dataURI);
      
      // Multi-currency support
      const currency = analysis.currency || "USD";
      const amount = analysis.amount || 0;
      let amountInUsd = amount;

      if (currency !== "USD") {
        try {
          const exchangeRes = await fetch(`https://open.er-api.com/v6/latest/USD`);
          const exchangeData = await exchangeRes.json();
          const rate = exchangeData.rates[currency];
          if (rate) {
            amountInUsd = amount / rate;
          }
        } catch (err) {
          console.error("Exchange rate fetch failed:", err);
        }
      }
      
      const updated = await storage.updateReceipt(receipt.id, {
        merchantName: analysis.merchantName || "Unknown Merchant",
        amount: amount,
        amountInUsd: amountInUsd,
        currency: currency,
        date: analysis.date ? new Date(analysis.date) : new Date(),
        category: analysis.category || "Uncategorized",
        items: analysis.items || [],
        rawText: analysis.rawText || "",
        status: "completed",
      });

      res.status(201).json(updated);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to process receipt" });
    }
  });

  app.get(api.receipts.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const receipts = await storage.getReceipts(req.user!.id);
    res.json(receipts);
  });

  app.get(api.receipts.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const receipt = await storage.getReceipt(Number(req.params.id));
    if (!receipt || receipt.userId !== req.user!.id) {
      return res.status(404).json({ message: "Receipt not found" });
    }
    res.json(receipt);
  });

  // Insights
  app.get(api.insights.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    const receipts = await storage.getReceipts(req.user!.id);
    const monthlyTotal = receipts.reduce((sum, r) => sum + (r.amountInUsd || r.amount || 0), 0);
    
    const categoryMap = new Map<string, number>();
    receipts.forEach(r => {
      const cat = r.category || "Uncategorized";
      categoryMap.set(cat, (categoryMap.get(cat) || 0) + (r.amountInUsd || r.amount || 0));
    });
    
    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, amount]) => ({
      category,
      amount
    }));

    // Generate AI insights if we have data
    let insights: string[] = [];
    if (receipts.length > 0) {
      const aiResult = await generateInsights(receipts);
      insights = aiResult.insights;
    }

    res.json({
      monthlyTotal,
      categoryBreakdown,
      insights
    });
  });

  // Nudges
  app.get(api.nudges.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const nudges = await storage.getNudges(req.user!.id);
    res.json(nudges);
  });

  app.patch(api.nudges.markRead.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const updated = await storage.markNudgeRead(Number(req.params.id));
    res.json(updated);
  });

  return httpServer;
}
