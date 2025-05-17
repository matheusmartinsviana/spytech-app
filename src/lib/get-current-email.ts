"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";

export async function getCurrentUserEmail(): Promise<string> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error("Usuário não autenticado");
  }

  return session.user.email;
}
