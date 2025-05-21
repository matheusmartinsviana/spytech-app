"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import FormatInsight from "@/components/shared/format-insight";
import { getAnalysisById } from "@/actions/analysis";
import { LockIcon } from "lucide-react";
import Image from "next/image";

export default function AnalysisPage() {
    const params = useParams();
    const { id } = params;
    // @ts-ignore
    const [analysis, setAnalysis] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadAnalysis() {
            if (typeof id === "string") {
                try {
                    const result = await getAnalysisById(id);
                    console.log("Análise:", result);
                    setAnalysis(result);
                } catch (error) {
                    console.error("Erro ao buscar análise:", error);
                } finally {
                    setLoading(false);
                }
            }
        }

        loadAnalysis();
    }, [id]);

    if (loading) {
        return (
            <main className="p-6 max-w-4xl mx-auto">
                <Skeleton className="h-8 w-1/2 mb-4" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-6 w-3/4 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
            </main>
        );
    }

    if (!analysis || !analysis.result || analysis.result.length === 0) {
        return (
            <p className="p-4 text-center text-muted-foreground">
                Análise não encontrada.
            </p>
        );
    }

    const { url } = analysis.result[0];

    return (
        <main className="p-6 max-w-4xl mx-auto overflow-y-auto">
            <h1 className="text-3xl font-bold text-center mb-10">
                Análise de Concorrência
            </h1>

            <Card className="mb-6">
                <CardContent className="space-y-2 flex flex-col">
                    <div className="flex items-center mb-2">
                        {/* <Image
                            className="inline-block mr-2 rounded-full"
                            width={32}
                            height={32}
                            src={analysis.result[0]?.mainPage?.data?.faviconUrl}
                            alt={`Favicon | ${analysis.result[0]?.mainPage?.data?.pageTitle}`}
                        /> */}
                        <p className="text-sm text-muted-foreground">
                            {analysis.result[0]?.mainPage?.data?.pageTitle}
                        </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            {url}
                        </a>
                    </p>

                    <div className="flex flex-wrap gap-2">
                        <div className="relative w-fit group">
                            <button
                                disabled
                                className="flex items-center gap-2 justify-center px-3 py-1.5 text-sm font-medium rounded-md 
               bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-600 
               cursor-not-allowed opacity-90"
                            >
                                <LockIcon className="w-4 h-4 text-gray-500" />
                                Analisar redes sociais
                            </button>

                            <span className="absolute top-[-10px] right-[-10px] bg-blue-900 text-xs text-white px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                Premium
                            </span>

                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block">
                                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg">
                                    Recurso exclusivo para assinantes
                                </div>
                            </div>
                        </div>
                        <div className="relative w-fit group">
                            <button
                                disabled
                                className="flex items-center gap-2 justify-center px-3 py-1.5 text-sm font-medium rounded-md 
               bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 text-gray-600 
               cursor-not-allowed opacity-90"
                            >
                                <LockIcon className="w-4 h-4 text-gray-500" />
                                Analisar todas as páginas
                            </button>

                            <span className="absolute top-[-10px] right-[-10px] bg-blue-900 text-xs text-white px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                                Premium
                            </span>

                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block">
                                <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 shadow-lg">
                                    Recurso exclusivo para assinantes
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Insight da Análise</CardTitle>
                </CardHeader>
                <CardContent>
                    <FormatInsight text={String(analysis.result[0].mainPage.insight)} />
                </CardContent>
            </Card>

            <footer className="mt-10 text-center text-muted-foreground text-sm">
                <p>
                    Este é um relatório gerado automaticamente para análise de
                    concorrência.
                </p>
                <p>
                    <strong>Data da Análise:</strong>{" "}
                    {new Date(analysis.created_at).toLocaleString()}
                </p>
            </footer>
        </main>
    );
}
