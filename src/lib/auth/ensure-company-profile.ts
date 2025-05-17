"use server";

import { getServerSession } from "next-auth";
import { hasCompletedCompanyProfile } from "@/actions/user";
import { redirect } from "next/navigation";
import { authOptions } from "../authOptions";

export async function ensureCompanyProfileCompleted() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const filled = await hasCompletedCompanyProfile(session.user.email);

    console.log("filled", filled);

  if (!filled) {
    redirect("/perfil-da-empresa");
  } 
}

export async function ensureCompanyProfileNotCompleted() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }

    const filled = await hasCompletedCompanyProfile(session.user.email);

    console.log("filled", filled);

  if (filled) {
    redirect("/");
  } 
}