 import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
 
 export const MockInterview=pgTable('mockInterview', {
    id:serial('id').primaryKey(),
    jsonMockResp:text('jsonockResp').notNull(),
    jobPosition:varchar('jobPosition').notNull(),
    jobDesc:varchar('jobDesc').notNull(),
    jobExperience:varchar('jobExperience').notNull(),
    createdBy:varchar('createdBy').notNull(),
    createdAt:varchar('createdAt'),
    mockId:varchar('mockId').notNull()
 })