'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentUserEmail } from "@/lib/get-current-email";
import { getAnalysisId } from "@/hooks/get/get-analysis-id";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    urls: string[];
    analyzedUrls: string[];
    loadingAnalyze: string | null;
    onAnalyzeUrl: (url: string) => void;
}

export function AnalyzeModal({
    open,
    onOpenChange,
    urls,
    analyzedUrls,
    loadingAnalyze,
    onAnalyzeUrl,
}: Props) {
    const [analysisLinks, setAnalysisLinks] = useState<{ [url: string]: string | null }>({});
    const [email, setEmail] = useState<string>("");

    useEffect(() => {
        const fetchEmailAndLinks = async () => {
            const currentEmail = await getCurrentUserEmail(); // Suporte para async
            setEmail(currentEmail);

            for (const url of analyzedUrls) {
                if (!analysisLinks[url]) {
                    try {
                        const result = await getAnalysisId(url, currentEmail); // Ex: { id: 'abc123' }
                        const link = `/analises/${result.id}`;
                        setAnalysisLinks((prev) => ({ ...prev, [url]: link }));
                    } catch (err) {
                        console.error(`Erro ao buscar análise de ${url}:`, err);
                        setAnalysisLinks((prev) => ({ ...prev, [url]: null }));
                    }
                }
            }
        };

        if (analyzedUrls.length > 0 && open) {
            fetchEmailAndLinks();
        }
    }, [analyzedUrls, open]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Encontramos 3 principais resultados!</DialogTitle>
                    <DialogDescription>
                        Aqui estão os links mais relevantes para sua pesquisa. Clique para analisar:
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col space-y-4">
                    {urls.map((url) => (
                        <div key={url} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between">
                                <span className="text-sm break-all">{url}</span>
                                <Button
                                    className="ml-2 cursor-pointer"
                                    size="sm"
                                    onClick={() => onAnalyzeUrl(url)}
                                    disabled={analyzedUrls.includes(url) || loadingAnalyze === url}
                                >
                                    {analyzedUrls.includes(url)
                                        ? <CheckCircle className="text-green-500" />
                                        : loadingAnalyze === url
                                            ? "Analisando..."
                                            : "Analisar"}
                                </Button>
                            </div>

                            {analyzedUrls.includes(url) && analysisLinks[url] && (
                                <Button
                                    variant="link"
                                    className="text-sm text-green-600 hover:text-green-700 w-fit px-0"
                                    asChild
                                >
                                    <a
                                        href={analysisLinks[url] || '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:underline text-sm flex items-center gap-1"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Ver análise concluída
                                    </a>
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
}
