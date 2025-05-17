'use client'

import { useSession, signOut } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function SettingsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login")
        }
    }, [status, router])

    if (status === "loading") {
        return <p>Carregando...</p>
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 space-y-4">
            <h1 className="text-2xl font-bold">Configurações da Conta</h1>

            <div className="flex items-center space-x-4">
                <Avatar>
                    <AvatarImage src={session?.user?.image || ""} />
                    <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium">{session?.user?.name}</p>
                    <p className="text-sm text-gray-500">{session?.user?.email}</p>
                </div>
                <Button onClick={() => signOut()} className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                </Button>
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Preferências</h2>
                <div className="space-y-2">
                    <label htmlFor="model" className="block text-sm font-medium">
                        Selecione o modelo de IA:
                    </label>
                    <Select disabled>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Gemini (Padrão)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="gemini">Gemini</SelectItem>
                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                            <SelectItem value="llama">Llama</SelectItem>
                            <SelectItem value="mistral">Mistral</SelectItem>
                        </SelectContent>
                    </Select>
                    <p className="text-sm">A seleção de modelos está desativada no momento.</p>
                </div>
            </div>
        </div>
    )
}
