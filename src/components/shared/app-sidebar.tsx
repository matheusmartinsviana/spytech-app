"use client";

import { useEffect, useState } from "react";
import { BarChart, Eye, FileText, LoaderIcon, Settings, Trash } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import ThemeToggle from "./theme-toggle";
import { getAllAnalyses, deleteAnalysis } from "@/lib/api";
import { motion } from 'framer-motion'
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

const staticItems = [
    {
        title: "Dashboard",
        url: "/",
        icon: BarChart,
    },
    {
        title: "Analisar Concorrentes",
        url: "/",
        icon: Eye,
    },
    {
        title: "Configurações",
        url: "/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [analysisToDelete, setAnalysisToDelete] = useState<string | null>(null);



    const fetchAllAnalyses = async () => {
        setLoading(true);
        try {
            const data = await getAllAnalyses();
            setRecentAnalyses(data);
            console.log("Análises recentes:", data);
        } catch (error: any) {
            console.error("Erro ao buscar análises:", error);
            setError("Erro ao buscar análises");
        } finally {
            setLoading(false);
        }
    };

    const requestDelete = (id: string) => {
        setAnalysisToDelete(id);
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        if (!analysisToDelete) return;

        setLoading(true);
        try {
            await deleteAnalysis(analysisToDelete);
            setRecentAnalyses(prev => prev.filter(analysis => analysis.id !== analysisToDelete));
            toast.success("Análise excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir análise:", error);
            toast.error("Erro ao excluir análise");
        } finally {
            setAnalysisToDelete(null);
            setShowConfirmModal(false);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchAllAnalyses();
    }, []);

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h1 className="mr-2">SpyTech</h1>
                            <span className="text-xs px-2 py-0.5 bg-black text-white dark:bg-white dark:text-black rounded-full uppercase">
                                Beta
                            </span>
                        </div>
                        <ThemeToggle />
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {staticItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}

                            {/* Análises Recentes */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <div className="flex items-center gap-2">
                                        <FileText />
                                        <span>Análises Recentes</span>
                                    </div>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <div style={{ paddingLeft: "20px" }}>
                                {error && (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <span className="text-red-500">{error}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}

                                {loading ? (
                                    <>
                                        <LoadingSkeleton />
                                    </>
                                ) : recentAnalyses.length > 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {recentAnalyses.map((analysis) => (
                                            <SidebarMenuItem key={analysis.id}>
                                                <SidebarMenuButton asChild>
                                                    <div className="flex items-center justify-between">
                                                        <a
                                                            href={`/analises/${analysis.id}`}
                                                            className="flex items-center gap-2"
                                                            title={
                                                                analysis.result?.[0]?.mainPage?.data?.pageTitle ?? "Sem título"
                                                            }
                                                        >
                                                            {analysis.result?.[0]?.mainPage?.data?.pageTitle?.slice(0, 20) ?? "Sem título"}...
                                                        </a>
                                                        <button
                                                            onClick={() => requestDelete(analysis.id)}
                                                            aria-label="Excluir análise"
                                                            className="p-2 rounded-md transition-all duration-200 ease-in-out cursor-pointer"
                                                        >
                                                            <Trash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                        <SidebarMenuItem>
                                            <SidebarMenuButton asChild>
                                                <Link href="/analises">Ver todas</Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </motion.div>
                                ) : (
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <span className="text-gray-500">Nenhuma análise disponível</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                            </div>


                            {showConfirmModal && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
                                        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                                            Confirmar exclusão
                                        </h2>
                                        <p className="mb-6 text-gray-600 dark:text-gray-300">
                                            Tem certeza de que deseja excluir esta análise?
                                        </p>
                                        <div className="flex justify-center gap-4">
                                            <button
                                                onClick={() => setShowConfirmModal(false)}
                                                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                onClick={confirmDelete}
                                                className={cn("px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition  cursor-pointer", {
                                                    "opacity-50 cursor-not-allowed": loading,
                                                }
                                                )}
                                            >
                                                {loading ? "Excluindo" : "Excluir"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}

function LoadingSkeleton() {
    return (
        <div className="flex items-center gap-2">
            <LoaderIcon className="animate-spin w-4 h-4 text-gray-500" />
            <span className="text-gray-500">Carregando...</span>
        </div>
    );
}