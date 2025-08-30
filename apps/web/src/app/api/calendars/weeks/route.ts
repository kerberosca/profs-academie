import { NextRequest, NextResponse } from "next/server";
import { CalendarWeek } from "../../../../types/lms";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body: CalendarWeek = await request.json();
    const { childId, weekStartISO, events } = body;

    if (!childId || !weekStartISO) {
      return NextResponse.json(
        { error: 'childId et weekStartISO sont requis' },
        { status: 400 }
      );
    }

    // Pour l'instant, on retourne simplement la semaine créée
    // Plus tard, on pourra l'enregistrer en base de données
    const calendarWeek: CalendarWeek = {
      childId,
      weekStartISO,
      events: events || []
    };

    return NextResponse.json(calendarWeek);
  } catch (error) {
    console.error('Erreur lors de la création de la semaine:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la semaine' },
      { status: 500 }
    );
  }
}
