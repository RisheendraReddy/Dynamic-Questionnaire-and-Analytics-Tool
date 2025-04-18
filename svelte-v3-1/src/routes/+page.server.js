import { db } from '../lib/server/db/index.js'
import { asc } from 'drizzle-orm'
import { questions, user } from '../lib/server/db/schema.js'

export const load = async () => {
    const allQuestions = await db.select()
        .from(questions)
        .orderBy(asc(questions.id));
    
    return {
        questions: allQuestions
    };
};

export const actions = {
    default: async ({ request }) => {
        // Get form data
        const formData = await request.formData();
        const userData = JSON.parse(formData.get('userData'));
        
        try {
            const result = await db.insert(user).values({
                name: userData.name,
                email: userData.email,
                user_selection: userData.answers
            }).returning();
            
            return {
                success: true,
                message: 'Response submitted successfully',
                data: result[0]
            };
        } catch (error) {
            console.error('Database insertion error:', error);
            return {
                success: false,
                message: 'Failed to submit response',
                error: error.message
            };
        }
    }
};