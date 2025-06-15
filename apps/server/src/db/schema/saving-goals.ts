 import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, decimal, boolean } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const savingGoals = pgTable("saving_goals", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).default("0").notNull(),
  targetDate: timestamp("target_date").notNull(),
  isCompleted: boolean("is_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const savingGoalsRelations = relations(savingGoals, ({ one }) => ({
  user: one(user, {
    fields: [savingGoals.userId],
    references: [user.id],
  }),
}));