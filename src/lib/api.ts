import { CompanyProfile } from "@/entities/company-profile";

export const getUrlsByKeywords = async (keywords: string) => {
  const response = await fetch(
    `http://localhost:3000/api/search?keywords=${encodeURIComponent(keywords)}`,
  );
  if (!response.ok) throw new Error("Erro ao buscar URLs");
  return response.json();
};

export const analyzeUrls = async (
  urls: string[],
  companyProfile?: CompanyProfile,
) => {
  if (!urls.length) throw new Error("Nenhuma URL fornecida para análise");

  if (!companyProfile)
    throw new Error("Perfil da empresa não fornecido para análise");

  const response = await fetch("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ urls, companyProfile }),
  });
  if (!response.ok) throw new Error("Erro ao analisar URLs");
  return response.json();
};

export const deleteAnalysis = async (id: string) => {
  if (!id.length) throw new Error("ID não fornecido");

  const response = await fetch(`http://localhost:3000/api/analyze`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) throw new Error("Erro ao excluir análise");
  return response.json(); 
};

export const getAllAnalyses = async () => {
  const response = await fetch("http://localhost:3000/api/analyses", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Erro ao buscar análises");
  return response.json();
};
