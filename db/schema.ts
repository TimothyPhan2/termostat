
import { integer, serial, pgTable, timestamp, text } from 'drizzle-orm/pg-core';


export const usersTable = pgTable('users_table', {
  user_id: text('user_id').primaryKey().notNull(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
  name: text('name').notNull(),
  streak: integer('streak').default(0).notNull(),
});

export const leaderboardTable = pgTable('leaderboard_table', {
  id: serial('id').primaryKey(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
  user_id: text('user_id').notNull().references(() => usersTable.user_id),
  score: integer('score').notNull(),
})

