export const getAnalysisId = async (url: string, email: string) => {
    if (!email) throw new Error("Email não fornecido");

    const response = await fetch(
        `http://localhost:3000/api/analyses/url?url=${url}&email=${email}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        },
    );
    if (!response.ok) throw new Error("Erro ao buscar ID da análise");
    return response.json();
}

export async function getAnalysisLink(url: string, email: string): Promise<string | null> {
    try {
        const data = await getAnalysisId(url, email); // deve retornar { id: "abc123" }
        return `/analise/${data.id}`;
    } catch (error) {
        console.error("Erro ao obter link da análise:", error);
        return null;
    }
}