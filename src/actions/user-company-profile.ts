'use server'

import { getDbConnection } from '@/lib/db'
import { getUserByEmail } from './user'

interface CompanyProfile {
  company_name: string
  segment: string
  website?: string
  description: string
  filled: boolean
}

export async function saveCompanyProfile(data: CompanyProfile, email: string) {
  const sql = await getDbConnection()

  const user = await getUserByEmail(email)
  if (!user) {
    throw new Error('User not found')
  }

  const result = await sql`
    UPDATE company_profiles
    SET 
      company_name = ${data.company_name},
      segment = ${data.segment},
      website = ${data.website ?? null},
      description = ${data.description},
      filled = ${data.filled ?? false}
    WHERE user_id = ${user.id}
    RETURNING *;
  `

  console.log(data)

  if (result.length === 0) {
    throw new Error('Failed to update company profile')
  }

  return result[0]
}

export async function getCompanyProfile(email: string) {
  const sql = await getDbConnection()

  const user = await getUserByEmail(email)
  if (!user) {
    throw new Error('User not found')
  }

  const result = await sql`
    SELECT * FROM company_profiles
    WHERE user_id = ${user.id}
  `

  if (result.length === 0) {
    throw new Error('Company profile not found')
  }

  return result[0]
}
  
  