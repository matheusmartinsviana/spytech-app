'use client';

import { useAnalyze } from "@/hooks/use-analyze";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { AnalyzeModal } from "./analyze-modal";

export function AnalyzeForm() {
    const {
        mode, setMode,
        input, setInput,
        loading,
        handleSubmit,
        showModal, setShowModal,
        urlsFound,
        analyzedUrls,
        loadingAnalyze,
        handleAnalyzeUrl,
        getAnalysisLink,
    } = useAnalyze();

    return (
        <div className="flex flex-col items-center w-full max-w-md space-y-6">
            <h1 className="text-3xl font-bold text-center">
                Qual concorrência você quer analisar? 👁
            </h1>

            <div className="flex items-center justify-center w-full mb-2">
                <label className="text-sm text-muted-foreground">Modo de análise:</label>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="ml-2 w-4 h-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <div className="text-sm">
                                <p><strong>Palavras-chave:</strong> busca os 3 principais concorrentes</p>
                                <p><strong>Link Direto:</strong> busca e já faz a análise do concorrente</p>
                            </div>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>

            <Select value={mode} onValueChange={(value) => setMode(value as "keywords" | "link")}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione o modo" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem disabled={loading} value="keywords">Palavras-chave</SelectItem>
                    <SelectItem disabled={loading} value="link">Link Direto</SelectItem>
                </SelectContent>
            </Select>

            <div className="flex flex-row w-full gap-4">
                <Input
                    disabled={loading}
                    placeholder={mode === "keywords" ? "Digite as palavras-chave..." : "Digite o link..."}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <Button onClick={handleSubmit} disabled={loading || !input}>
                    {loading ? "Analisando..." : "Enviar"}
                </Button>
            </div>

            <AnalyzeModal
                open={showModal}
                onOpenChange={setShowModal}
                urls={urlsFound}
                loadingAnalyze={loadingAnalyze}
                analyzedUrls={analyzedUrls}
                onAnalyzeUrl={handleAnalyzeUrl}
                // @ts-ignore
                getAnalysisLink={getAnalysisLink}
            />
        </div>
    );
}
