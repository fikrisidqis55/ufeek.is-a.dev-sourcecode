import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { name, email, message } = body;

		if (!name || !email || !message) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const newMessage = await prisma.message.create({
			data: { name, email, message }
		});

		return json({ success: true, data: newMessage });
	} catch (error) {
		console.error('Error saving message:', error);
		return json({ error: 'Something went wrong' }, { status: 500 });
	}
};
