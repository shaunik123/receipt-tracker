import { db } from "./db";
import { users, receipts, nudges } from "@shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    // Create test user
    const password = await hashPassword("password123");
    const [user] = await db.insert(users).values({
      username: "demo",
      password,
    }).onConflictDoNothing().returning();

    if (user) {
      console.log("Created demo user");
      
      // Add sample receipts
      await db.insert(receipts).values([
        {
          userId: user.id,
          merchantName: "Whole Foods Market",
          amount: 84.50,
          date: new Date("2025-01-02"),
          category: "Groceries",
          imageUrl: "placeholder",
          status: "completed",
          items: [
            { name: "Organic Bananas", price: 2.99 },
            { name: "Almond Milk", price: 4.50 },
            { name: "Chicken Breast", price: 12.99 }
          ]
        },
        {
          userId: user.id,
          merchantName: "Uber",
          amount: 24.00,
          date: new Date("2025-01-03"),
          category: "Transport",
          imageUrl: "placeholder",
          status: "completed",
          items: [{ name: "Ride to Airport", price: 24.00 }]
        },
        {
          userId: user.id,
          merchantName: "Netflix",
          amount: 15.99,
          date: new Date("2025-01-01"),
          category: "Entertainment",
          imageUrl: "placeholder",
          status: "completed",
          items: [{ name: "Standard Plan", price: 15.99 }]
        }
      ]);
      console.log("Added sample receipts");

      // Add sample nudges
      await db.insert(nudges).values([
        {
          userId: user.id,
          title: "Spending Alert",
          message: "You've spent 20% more on Transport this week compared to last week.",
          type: "alert",
          isRead: false
        },
        {
          userId: user.id,
          title: "Savings Tip",
          message: "Looks like you have multiple subscriptions. Review them to save ~$15/mo.",
          type: "insight",
          isRead: false
        }
      ]);
      console.log("Added sample nudges");
    }
  } catch (error) {
    console.error("Seed error:", error);
  }
}

seed().then(() => {
  console.log("Seeding complete");
  process.exit(0);
});
