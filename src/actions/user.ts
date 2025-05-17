"use server";

import { GoogleUser } from "@/entities/google-user";
import { getDbConnection } from "@/lib/db";

export async function findOrCreateUser(user: GoogleUser) {
  const sql = await getDbConnection();

  const existingUser = await sql`
    SELECT * FROM users WHERE google_id = ${user.googleId};
  `;

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  const newUser = await sql`
    INSERT INTO users (google_id, name, email)
    VALUES (${user.googleId}, ${user.name}, ${user.email})
    RETURNING *;
  `;

  return newUser[0];
}

export async function getUserById(id: number) {
  const sql = await getDbConnection();

  const user = await sql`
    SELECT * FROM users WHERE google_id = ${id};
  `;

  if (user.length === 0) {
    console.log("User not found");
    return null;
  }
  
  return user[0];
}

export async function getUserByEmail(email: string) {
  const sql = await getDbConnection();

  const user = await sql`
    SELECT * FROM users WHERE email = ${email};
  `;

  if (user.length === 0) {
    console.log("User not found");
    return null;
  }
  
  return user[0];
}

export async function hasCompletedCompanyProfile(email: string): Promise<boolean> {
  const sql = await getDbConnection();

  const user = await getUserByEmail(email)

  if (!user) {
    console.log("User not found");
    return false; 
  }

  const result = await sql`
    SELECT filled
    FROM company_profiles
    WHERE user_id = ${user?.id};
  `;

  console.log("result", result)

  if (result.length === 0) {
    return false; 
  }

  return result[0].filled == true;
}

export async function getUserAnalysisRequestsCount(email: string): Promise<number> {
  const sql = await getDbConnection();

  const result = await sql`
    SELECT analysis_requests_count
    FROM users
    WHERE email = ${email};
  `;

  if (result.length === 0 || result[0].analysis_requests_count === null) {
    return 0;
  }

  return result[0].analysis_requests_count;
}