"use client";

import { useEffect, useState } from "react";
import { ResultCard } from "@/components/common/result-card";
import { getAllAnalyses } from "@/lib/api";
import { motion } from "framer-motion";

type Result = {
    id: string;
    title: string;
    insight: string;
    url: string;
    faviconUrl: string;
    createdAt: string;
};

export default function AnalisysPage() {
    const [results, setResults] = useState<Result[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalyses = async () => {
            try {
                const data = await getAllAnalyses();
                // @ts-ignore
                const formattedResults: Result[] = data.map((analysis: any) => {
                    const resultData = analysis.result?.[0]?.mainPage;
                    console.log("Result Data:", resultData);

                    return {
                        id: analysis.id,
                        title: resultData?.data.pageTitle ?? "Sem título",
                        insight: resultData?.insight ?? "Sem insights disponíveis.",
                        url: resultData?.url ?? analysis.competitor_website ?? "URL indisponível",
                        faviconUrl: resultData?.data.faviconUrl ?? "",
                        createdAt: analysis.created_at,
                    };
                });

                setResults(formattedResults);
            } catch (err) {
                console.error("Erro ao buscar análises:", err);
                setError("Erro ao carregar análises.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyses();
    }, []);

    if (loading) {
        return (
            <LoadingSkeleton />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto p-6 space-y-6 overflow-y-auto"
            >
            <header className="text-center">
                <h1 className="text-4xl font-bold">Análises</h1>
                <p className="text-muted-foreground mt-2">
                    Veja abaixo os resultados das suas análises salvas.
                </p>
            </header>

            {error && (
                <div className="text-center mt-6">
                    <p className="text-red-500 text-lg">{error}</p>
                </div>
            )}

            {results.length === 0 ? (
                <div className="text-center mt-10">
                    <p className="text-muted-foreground text-lg">
                        Nenhuma análise encontrada.
                    </p>
                </div>
            ) : (
                <section
                    className="grid gap-4 overflow-y-auto"
                    aria-label="Lista de análises"
                >
                    {results.map((result) => (
                        <ResultCard key={result.id} analysisResult={result} />
                    ))}
                </section>
            )}
        </motion.div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <header className="text-center">
                <h1 className="text-4xl font-bold animate-pulse">Análises</h1>
                <p className="text-muted-foreground mt-2 animate-pulse">
                    Carregando análises...
                </p>
            </header>

            <section className="grid gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <div
                        key={index}
                        className="bg-gray-100 h-32 rounded-lg animate-pulse min-w-[400px]"
                    />
                ))}
            </section>
        </div>
    );
}
