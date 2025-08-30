import bcrypt from "bcryptjs";
import { db } from "./db";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, 10);
}

export async function verifyPin(pin: string, hashedPin: string): Promise<boolean> {
  return bcrypt.compare(pin, hashedPin);
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
    include: {
      foyer: {
        include: {
          enfants: true,
        },
      },
      profilProf: true,
      abonnements: {
        include: {
          plans: true,
        },
        where: {
          statut: {
            in: ["ACTIVE", "TRIAL"],
          },
        },
      },
    },
  });
}

export async function getEnfantByPin(pin: string, foyerId: string) {
  const enfants = await db.enfant.findMany({
    where: { foyerId },
    include: {
      foyer: {
        include: {
          parent: true,
        },
      },
    },
  });

  for (const enfant of enfants) {
    if (await verifyPin(pin, enfant.pinHash)) {
      return enfant;
    }
  }

  return null;
}
