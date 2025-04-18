import { pgTable, serial, text, integer, json, pgEnum } from 'drizzle-orm/pg-core';

export const user = pgTable('userResponse', {
	id: serial('id').primaryKey(),
	name: text("name"),
	email: text('email'),
	user_selection: json('answers')
});

export const questions = pgTable('questions', {
	id: serial('id').primaryKey(),
	question: text('question'),
	category: text('category'),
	answers: json('answers')
});

