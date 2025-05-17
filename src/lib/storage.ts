import { Analysis } from "@/entities/analysis";

const STORAGE_KEY = 'analyses';

export const saveAnalysis = (analysis: Analysis) => {
  const stored = localStorage.getItem(STORAGE_KEY);
  const analyses = stored ? JSON.parse(stored) as Analysis[] : [];
  analyses.push(analysis);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analyses));
};

export const getAnalysisById = (id: string): Analysis | undefined => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return undefined;
  const analyses = JSON.parse(stored) as Analysis[];
  return analyses.find(a => a.id === id);
};

export const getAnalysisByUrl = (url: string): Analysis | undefined => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return undefined;
  const analyses = JSON.parse(stored) as Analysis[];
  return analyses.find(a => a.results[0]?.url === url);
}
