import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
  primaryKey,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// Auth.js tables
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  role: text("role").notNull().default("user"),
  xp: integer("xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  lastCheckIn: text("last_check_in"),
  checkInStreak: integer("check_in_streak").notNull().default(0),
  dailyFortuneId: text("daily_fortune_id"),
  points: integer("points").notNull().default(0),
  equippedAvatarFrame: text("equipped_avatar_frame"),
  equippedTitleBadge: text("equipped_title_badge"),
  /** Public display ID — unique, permanent, shown as #10001 */
  readerId: integer("reader_id").unique(),
  /** Successful nickname changes (first change is free). */
  nameChangeCount: integer("name_change_count").notNull().default(0),
  /** Successful avatar uploads (first upload is free). */
  avatarChangeCount: integer("avatar_change_count").notNull().default(0),
  /** Wheel lottery tickets — substitute for point cost per spin. */
  wheelTickets: integer("wheel_tickets").notNull().default(0),
  /** Wheel luck — improves rare prize weights over time. */
  wheelLuck: integer("wheel_luck").notNull().default(0),
  /** Legend shards — collect to redeem permanent legendary frame. */
  legendShards: integer("legend_shards").notNull().default(0),
  /** Last calendar date (Asia/Shanghai) a free wheel spin was used. */
  lastFreeWheelDate: text("last_free_wheel_date"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// Forum tables
export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const threads = pgTable("threads", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  authorId: uuid("author_id").references(() => users.id, {
    onDelete: "set null",
  }),
  guestName: text("guest_name"),
  viewCount: integer("view_count").notNull().default(0),
  pinned: boolean("pinned").notNull().default(false),
  pinnedAt: timestamp("pinned_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  threadId: uuid("thread_id")
    .notNull()
    .references(() => threads.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  authorId: uuid("author_id").references(() => users.id, {
    onDelete: "set null",
  }),
  guestName: text("guest_name"),
  parentId: uuid("parent_id"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const threadLikes = pgTable(
  "thread_likes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    threadId: uuid("thread_id")
      .notNull()
      .references(() => threads.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.threadId] })]
);

export const commentLikes = pgTable(
  "comment_likes",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    commentId: uuid("comment_id")
      .notNull()
      .references(() => comments.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.commentId] })]
);

export const threadFavorites = pgTable(
  "thread_favorites",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    threadId: uuid("thread_id")
      .notNull()
      .references(() => threads.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.threadId] })]
);

export const threadViews = pgTable(
  "thread_views",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    threadId: uuid("thread_id")
      .notNull()
      .references(() => threads.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.threadId] })]
);

export const userShopItems = pgTable(
  "user_shop_items",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    itemSlug: text("item_slug").notNull(),
    purchasedAt: timestamp("purchased_at", { mode: "date" }).defaultNow().notNull(),
    /** Null = permanent (wheel grand prize). Shop purchases always set a date. */
    expiresAt: timestamp("expires_at", { mode: "date" }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.itemSlug] })]
);

/** Time-limited shop item trials (wheel grants, events). */
export const userItemGrants = pgTable("user_item_grants", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  itemSlug: text("item_slug").notNull(),
  source: text("source").notNull().default("wheel"),
  grantedAt: timestamp("granted_at", { mode: "date" }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { mode: "date" }).notNull(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  threadId: uuid("thread_id")
    .notNull()
    .references(() => threads.id, { onDelete: "cascade" }),
  threadSlug: text("thread_slug").notNull(),
  commentId: uuid("comment_id"),
  actorId: uuid("actor_id").references(() => users.id, { onDelete: "set null" }),
  actorName: text("actor_name"),
  body: text("body").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const userAchievements = pgTable(
  "user_achievements",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    achievementId: text("achievement_id").notNull(),
    unlockedAt: timestamp("unlocked_at", { mode: "date" }).defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.achievementId] })]
);

export const userWeeklyTasks = pgTable(
  "user_weekly_tasks",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    weekStart: text("week_start").notNull(),
    taskId: text("task_id").notNull(),
    progress: integer("progress").notNull().default(0),
    completedAt: timestamp("completed_at", { mode: "date" }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.weekStart, t.taskId] })]
);

export const userDailyPoints = pgTable(
  "user_daily_points",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    date: text("date").notNull(),
    category: text("category").notNull(),
    points: integer("points").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.userId, t.date, t.category] })]
);

export const rateLimitEvents = pgTable("rate_limit_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  threads: many(threads),
  comments: many(comments),
  threadLikes: many(threadLikes),
  commentLikes: many(commentLikes),
  threadFavorites: many(threadFavorites),
  shopItems: many(userShopItems),
  itemGrants: many(userItemGrants),
  notifications: many(notifications),
  achievements: many(userAchievements),
  weeklyTasks: many(userWeeklyTasks),
  dailyPoints: many(userDailyPoints),
}));

export const userItemGrantsRelations = relations(userItemGrants, ({ one }) => ({
  user: one(users, {
    fields: [userItemGrants.userId],
    references: [users.id],
  }),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
  threads: many(threads),
}));

export const threadsRelations = relations(threads, ({ one, many }) => ({
  category: one(categories, {
    fields: [threads.categoryId],
    references: [categories.id],
  }),
  author: one(users, {
    fields: [threads.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  thread: one(threads, {
    fields: [comments.threadId],
    references: [threads.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Thread = typeof threads.$inferSelect;
export type Comment = typeof comments.$inferSelect;
