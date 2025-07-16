import { pgTable, varchar, serial, text, integer } from 'drizzle-orm/pg-core';

export const MockInterview = pgTable('mockInterview', {
  id: serial('id').primaryKey(),
  mockId: text('mockId').notNull(),
  jsonockResp: text('jsonockResp').notNull(), 
  jobPosition: varchar('jobPosition').notNull(),
  jobDesc: varchar('jobDesc').notNull(),
  jobExperience: varchar('jobExperience').notNull(),
  createdBy: varchar('createdBy').notNull(),
  createdAt: varchar('createdAt'),
});

export const UserAnswer = pgTable('userAnswer', {
  id: serial('id').primaryKey(),
  mockIdRef: varchar('mockId').notNull(),
  question: text('question').notNull(),
  userAnswer: text('userAnswer'),
  feedback: text('feedback'),
  rating: integer('rating'),
  userEmail: varchar('userEmail'),
  createdAt: varchar('createdAt'),
});