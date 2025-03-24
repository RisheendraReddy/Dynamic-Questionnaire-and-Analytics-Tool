import { db } from '../lib/server/db/index.js'
import { asc } from 'drizzle-orm'
import { questions } from '../lib/server/db/schema.js'

export const load = async () => {
    const allQuestions = await db.select()
        .from(questions)
        .orderBy(asc(questions.id));
    
    return {
        questions: allQuestions
    };
};
