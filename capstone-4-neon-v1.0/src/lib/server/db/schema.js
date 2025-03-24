import { pgTable, serial, text, integer, json, pgEnum } from 'drizzle-orm/pg-core';

export const user = pgTable('userResponse', {
	name: serial('id').primaryKey(),
	email: text('email'),
	user_selection: json('answers')
});

export const questions = pgTable('questions', {
	id: serial('id').primaryKey(),
	question: text('question'),
	category: text('category'),
	answers: json('answers')
});

