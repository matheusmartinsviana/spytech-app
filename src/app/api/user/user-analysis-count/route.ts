import { getUserAnalysisRequestsCount } from "@/actions/user";

export async function POST(req: Request) {
    try {
        const email = await req.json();

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email não fornecido' }), { status: 400 });
        }

        const result = await getUserAnalysisRequestsCount(email);
        console.log("result", result)
        if (!result && result !== 0) {
            return new Response(JSON.stringify({ error: 'Nenhum resultado encontrado' }), { status: 404 });
        }

        return new Response(JSON.stringify({ count: result }), { status: 200 });
    } catch (error) {
        console.error('Erro:', error);
        return new Response(JSON.stringify({ error: 'Erro ao buscar a quantidade de análises.' }), { status: 500 });
    }
}