import { NextRequest, NextResponse } from "next/server";
import { UpdateEventRequest } from "../../../../../types/lms";

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body: UpdateEventRequest = await request.json();
    const { startISO, endISO } = body;

    if (!id || !startISO || !endISO) {
      return NextResponse.json(
        { error: 'ID et horaires requis' },
        { status: 400 }
      );
    }

    // Pour l'instant, on retourne simplement l'événement mis à jour
    // Plus tard, on pourra l'enregistrer en base de données
    const updatedEvent = {
      id,
      startISO,
      endISO,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json({ event: updatedEvent });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'événement' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'ID requis' },
        { status: 400 }
      );
    }

    // Pour l'instant, on retourne simplement une confirmation
    // Plus tard, on pourra supprimer de la base de données
    return NextResponse.json({ 
      message: 'Événement supprimé avec succès',
      deletedId: id
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'événement:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'événement' },
      { status: 500 }
    );
  }
}
