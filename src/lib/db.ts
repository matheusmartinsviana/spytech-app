"use server";

import { neon } from "@neondatabase/serverless";

export async function getDbConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error("A url de conexão com o banco de dados não foi encontrada");
  }
  const sql = neon(process.env.DATABASE_URL);
  return sql;
}