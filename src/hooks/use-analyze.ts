import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { analyzeUrls, getUrlsByKeywords } from "@/lib/api";
// import { createAnalysis } from "@/usecases/create-analysis";
import { getCurrentUserEmail } from "@/lib/get-current-email";
import { getCompanyProfile } from "@/actions/user-company-profile";
import { getAnalysisByUrl } from "@/lib/storage";
import { CompanyProfile } from "@/entities/company-profile";
import { createAnalysisRequest } from "@/actions/analysis";
import { getUserByEmail } from "@/actions/user";
import { getUserAnalysisResquestCount } from "./get/user-analysis-count";

export function useAnalyze() {
  const [mode, setMode] = useState<"keywords" | "link">("keywords");
  const [input, setInput] = useState("");
  const [loadingAnalyze, setLoadingAnalyze] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [urlsFound, setUrlsFound] = useState<string[]>([]);
  const [analyzedUrls, setAnalyzedUrls] = useState<string[]>([]);
  const [analysisIds, setAnalysisIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    toast.loading("Carregando análise...");
    try {
      const email = await getCurrentUserEmail();
      if (!email) throw new Error("Usuário não autenticado");

      const requestAnalysisCount = await getUserAnalysisResquestCount(email);
      if (requestAnalysisCount?.count >= 3) {
        toast.error("Limite de 3 análises diárias atingido.");
        return;
      }

      const companyProfile = await getCompanyProfile(email);
      if (!companyProfile) throw new Error("Perfil da empresa não encontrado");

      const userId = await getUserByEmail(email);
      if (!userId) throw new Error("Usuário não encontrado");

      if (mode === "keywords") {
        toast.info(`🔍 Buscando URLs para: ${input}...`);
        toast.loading("Filtrando pelos resultados mais relevantes...");
        const { urls } = await getUrlsByKeywords(input);
        toast.success("URLs encontradas com sucesso! 🤖");
        setUrlsFound(urls.slice(0, 3));
        setShowModal(true);
      } else {
        toast.dismiss();
        toast.loading(`🔍 Analisando URL: ${input}`);
        toast.loading("Extraindo dados do concorrente... 🕵️‍♂️");
        const urls = [input];
        const { results } = await analyzeUrls(
          urls,
          companyProfile as CompanyProfile,
        );
        toast.success("Salvando dados da análise... 💾");
        const analysis = await createAnalysisRequest({
          userId: userId.id,
          competitorName: results[0]?.mainPage?.pageTitle,
          competitorWebsite: input,
          promptInput: input,
          result: results,
        });
        setAnalysisIds([analysis.id]);
        toast.success("Análise salva com sucesso! ✅");
        router.push(`/analises/${analysis.id}`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao processar a análise.");
    } finally {
      setLoading(false);
      toast.dismiss();
    }
  };

  const handleAnalyzeUrl = async (url: string) => {
    try {
      const email = await getCurrentUserEmail();
      if (!email) throw new Error("Usuário não autenticado");

      const companyProfile = await getCompanyProfile(email);
      if (!companyProfile) throw new Error("Perfil da empresa não encontrado");

      const user = await getUserByEmail(email);
      if (!user) throw new Error("Usuário não encontrado");

      setLoadingAnalyze(url);
      toast(`Analisando URL: ${url}`);
      const { results } = await analyzeUrls(
        [url],
        companyProfile as CompanyProfile,
      );
      const analysis = await createAnalysisRequest({
        userId: user.id,
        competitorName: results[0]?.mainPage?.pageTitle,
        competitorWebsite: url,
        promptInput: url,
        result: results,
      });
      setAnalyzedUrls((prev) => [...prev, url]);
      setAnalysisIds((prev) => [...prev, analysis.id]);
      toast.success(`Análise concluída para: ${url}`);
    } catch (error) {
      console.error(error);
      toast.error(`Erro ao analisar o link: ${url}`);
    } finally {
      setLoadingAnalyze(null);
    }
  };

  const getAnalysisLink = (url: string) => {
    const analysis = getAnalysisByUrl(url);
    return analysis ? `/analises/${analysis.id}` : null;
  };

  return {
    mode,
    setMode,
    input,
    setInput,
    loading,
    handleSubmit,
    showModal,
    setShowModal,
    urlsFound,
    analyzedUrls,
    loadingAnalyze,
    handleAnalyzeUrl,
    getAnalysisLink,
  };
}
