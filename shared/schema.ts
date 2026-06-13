import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Database tables for PostgreSQL
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// MongoDB schema definitions
export interface UnitStat {
  movement: string;
  armor: string;
  attack: number;
  range: string;
  special?: string;
}

export interface StatModifier {
  movement?: string;
  armor?: string;
  attack?: number;
  range?: string;
  special?: string;
}

export interface Upgrade {
  id: string;
  name: string;
  pointCost: number;
  statModifiers: StatModifier;
}

export type UnitType = 'infantry' | 'vehicle' | 'tank' | 'asset';
export type Veterancy = 'Conscript' | 'Trained' | 'Experienced' | 'Veteran';

export interface Unit {
  id: string;
  name: string;
  type: UnitType;
  pointCost: number;
  stats: UnitStat;
  upgrades: Upgrade[];
  veterancy: Veterancy;
  faction?: string;
  division?: string;
}

export interface ArmyUnit extends Unit {
  selectedUpgrades: string[];
  totalPointCost: number;
  finalStats: UnitStat;
  veterancy: Veterancy;
}

export interface Army {
  id: string;
  name: string;
  faction?: string;
  units: ArmyUnit[];
  pointCap: number;
  totalPoints: number;
}
