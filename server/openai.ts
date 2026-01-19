import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024.
// do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.AI_INTEGRATIONS_OPENAI_API_KEY || "dummy-key",
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL
});

export async function analyzeReceipt(imageUrl: string): Promise<{
  merchantName?: string;
  amount?: number;
  date?: string; // ISO string
  category?: string;
  items?: { name: string; price: number }[];
  rawText?: string;
  currency?: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this receipt image. Extract the merchant name, total amount, date, category (e.g., Food, Transport, Utilities), a list of items with their prices, and the currency code (e.g., USD, EUR, GBP, JPY). Return the result as a JSON object." },
            {
              type: "image_url",
              image_url: {
                "url": imageUrl,
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) return {};
    
    const data = JSON.parse(content);
    return {
      merchantName: data.merchant_name || data.merchantName || data.merchant,
      amount: parseFloat(data.total_amount || data.amount || data.total || "0"),
      date: data.date,
      category: data.category,
      items: data.items || [],
      rawText: JSON.stringify(data),
      currency: data.currency || "USD",
    };
  } catch (error) {
    console.error("OpenAI Receipt Analysis Error:", error);
    return {};
  }
}

export async function generateInsights(expenses: any[]): Promise<{
  insights: string[];
}> {
  try {
    const prompt = `Analyze these expenses and provide 3 brief, actionable insights or nudges for the user. Focus on spending habits, category spikes, or saving opportunities. Expenses: ${JSON.stringify(expenses.slice(0, 20))}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message.content || "";
    // Split by newlines or bullet points and filter empty
    const insights = content.split('\n').filter(line => line.trim().length > 0).map(line => line.replace(/^[•-]\s*/, ''));
    
    return { insights: insights.slice(0, 3) };
  } catch (error) {
    console.error("OpenAI Insights Error:", error);
    return { insights: [] };
  }
}
