
import { integer, serial, pgTable, timestamp, text } from 'drizzle-orm/pg-core';


export const usersTable = pgTable('users_table', {
  user_id: text('user_id').primaryKey().notNull(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
  name: text('name'),
  streak: integer('streak').default(0).notNull(),
  profile_pic: text('profile_pic').notNull(),

});

export const leaderboardTable = pgTable('leaderboard_table', {
  id: serial('id').primaryKey(),
  createTs: timestamp('create_ts').defaultNow().notNull(),
  user_id: text('user_id').notNull().references(() => usersTable.user_id).unique(),
  score: integer('score').notNull(),
  gamesWon: integer('games_won').notNull(),
})

