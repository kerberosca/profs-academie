import { NextRequest, NextResponse } from "next/server";
import { CreateEventRequest, CalendarEvent } from "../../../../types/lms";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body: CreateEventRequest = await request.json();
    const { childId, courseId, startISO, endISO } = body;

    if (!childId || !courseId || !startISO || !endISO) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Créer un nouvel événement
    const event: CalendarEvent = {
      id: `event-${Date.now()}-${Math.random()}`,
      childId,
      courseId,
      startISO,
      endISO
    };

    return NextResponse.json({ event });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'événement' },
      { status: 500 }
    );
  }
}
