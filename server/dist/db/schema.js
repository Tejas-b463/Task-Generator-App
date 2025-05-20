"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasks = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.tasks = (0, pg_core_1.pgTable)("tasks", {
    id: (0, pg_core_1.serial)("id").primaryKey(),
    userId: (0, pg_core_1.text)("userid").notNull(),
    title: (0, pg_core_1.text)("title").notNull(),
    completed: (0, pg_core_1.boolean)("completed").default(false),
    createdAt: (0, pg_core_1.timestamp)("created_at").defaultNow(),
    topic: (0, pg_core_1.text)("topic").notNull()
});
