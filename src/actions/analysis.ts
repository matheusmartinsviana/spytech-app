"use server";

import { getDbConnection } from "@/lib/db";

type CreateAnalysisInput = {
  id?: string; // UUID
  userId: string; // UUID
  competitorName: string;
  competitorWebsite: string;
  promptInput: string;
  result: object[];
};

export async function createAnalysisRequest(data: CreateAnalysisInput) {
  const sql = await getDbConnection();

  const newAnalysis = await sql`
    INSERT INTO analysis_requests (
      user_id,
      competitor_name,
      competitor_website,
      prompt_input,
      result
    )
    VALUES (
      ${data.userId},
      ${data.competitorName},
      ${data.competitorWebsite},
      ${data.promptInput},
      ${JSON.stringify(data.result)}
    )
    RETURNING *;
  `;

  return newAnalysis[0];
}

export async function getAnalysisById(id: string) {
  const sql = await getDbConnection();

  const analysis = await sql`
      SELECT *
      FROM analysis_requests
      WHERE id = ${id};
    `;

  if (analysis.length === 0) {
    console.log("Analysis not found");
    return null;
  }

  return analysis[0];
}

export async function getAllAnalysesByUserId(userId: string) {
  const sql = await getDbConnection();

  const analyses = await sql`
      SELECT * 
      FROM analysis_requests 
      WHERE user_id = ${userId};
  `;

  if (analyses.length === 0) {
    console.log("No analyses found for this user");
    return { analyses: [] }; // Ensure the return structure matches what the frontend expects
  }

  return { analyses: analyses };
}

export const deleteAnalysisById = async (id: string) => {
  const db = await getDbConnection();

  const analysis = await db.query(
    'SELECT * FROM analysis_requests WHERE id = $1',
    [id]
  );

  if (analysis.length === 0) {
    throw new Error('Análise não encontrada');
  }

  await db.query(
    'DELETE FROM analysis_requests WHERE id = $1',
    [id]
  );

  return { message: 'Análise excluída com sucesso' };
};

export const getLatestAnalysisByUrl = async (url: string, email: string) => {
  const sql = await getDbConnection();

  const user = await sql.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );

  if (user.length === 0) {
    throw new Error('Usuário não encontrado');
  }

  const analysis = await sql.query(`
    SELECT * FROM analysis_requests
    WHERE user_id = $1 AND competitor_website = $2
    ORDER BY created_at DESC
    LIMIT 1
  `, [user[0].id, url]);

  if (analysis.length === 0) {
    throw new Error('Análise não encontrada');
  }

  return analysis[0];
};
