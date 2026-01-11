import { db } from "./db";
import { users, receipts, nudges, type User, type InsertUser, type Receipt, type InsertReceipt, type Nudge, type InsertNudge } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  sessionStore: session.Store;

  createReceipt(receipt: InsertReceipt & { userId: number, imageUrl: string }): Promise<Receipt>;
  getReceipts(userId: number): Promise<Receipt[]>;
  getReceipt(id: number): Promise<Receipt | undefined>;
  updateReceipt(id: number, updates: Partial<Receipt>): Promise<Receipt>;

  createNudge(nudge: InsertNudge & { userId: number }): Promise<Nudge>;
  getNudges(userId: number): Promise<Nudge[]>;
  markNudgeRead(id: number): Promise<Nudge>;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createReceipt(receipt: InsertReceipt & { userId: number, imageUrl: string }): Promise<Receipt> {
    const [newReceipt] = await db.insert(receipts).values(receipt).returning();
    return newReceipt;
  }

  async getReceipts(userId: number): Promise<Receipt[]> {
    return db.select().from(receipts).where(eq(receipts.userId, userId)).orderBy(desc(receipts.createdAt));
  }

  async getReceipt(id: number): Promise<Receipt | undefined> {
    const [receipt] = await db.select().from(receipts).where(eq(receipts.id, id));
    return receipt;
  }

  async updateReceipt(id: number, updates: Partial<Receipt>): Promise<Receipt> {
    const [updated] = await db.update(receipts).set(updates).where(eq(receipts.id, id)).returning();
    return updated;
  }

  async createNudge(nudge: InsertNudge & { userId: number }): Promise<Nudge> {
    const [newNudge] = await db.insert(nudges).values(nudge).returning();
    return newNudge;
  }

  async getNudges(userId: number): Promise<Nudge[]> {
    return db.select().from(nudges).where(eq(nudges.userId, userId)).orderBy(desc(nudges.createdAt));
  }

  async markNudgeRead(id: number): Promise<Nudge> {
    const [updated] = await db.update(nudges).set({ isRead: true }).where(eq(nudges.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
