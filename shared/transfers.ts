import { pgTable, text, serial, integer, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Real money transfers table
export const transfers = pgTable("transfers", {
  id: serial("id").primaryKey(),
  transferId: text("transfer_id").notNull(), // Alpaca transfer ID
  accountId: text("account_id").notNull(),
  connectionId: integer("connection_id").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  direction: text("direction").notNull(), // 'INCOMING' | 'OUTGOING'
  type: text("type").notNull(), // 'ACH' | 'WIRE' | 'CHECK'
  status: text("status").notNull().default('PENDING'), // 'PENDING' | 'COMPLETED' | 'REJECTED' | 'CANCELLED'
  externalId: text("external_id"), // Bank reference number
  reason: text("reason"), // Rejection reason if applicable
  expectedSettlement: timestamp("expected_settlement"), // When funds will be available
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Transfer = typeof transfers.$inferSelect;
export type InsertTransfer = typeof transfers.$inferInsert;

export const insertTransferSchema = createInsertSchema(transfers);
export const selectTransferSchema = z.object({
  id: z.number(),
  transferId: z.string(),
  accountId: z.string(),
  connectionId: z.number(),
  amount: z.string(),
  direction: z.string(),
  type: z.string(),
  status: z.string(),
  externalId: z.string().nullable(),
  reason: z.string().nullable(),
  expectedSettlement: z.date().nullable(),
  completedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});