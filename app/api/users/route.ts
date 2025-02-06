import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Habit {
    name: string;
    description?: string;
  }
  
  interface CreateUserRequest {
    name: string;
    email: string;
    habits: Habit[];
  }

export async function POST(req: NextRequest) {
  try {
    const body :CreateUserRequest = await req.json();
    const { name, email, habits } = body;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        habits: {
          create: habits.map((habit: { name: string; description?: string }) => ({
            name: habit.name,
            description: habit.description || null,
          })),
        },
      },
      include: { habits: true },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Errore nel creare l’utente' }, { status: 500 });
  }
}
