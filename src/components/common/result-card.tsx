import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

type ResultCardProps = {
    analysisResult: {
        id: string;
        title: string;
        insight: string;
        url: string;
        faviconUrl: string;
        createdAt: string;
    };
};

export function ResultCard({ analysisResult }: ResultCardProps) {
    const { id, title, insight, url, faviconUrl, createdAt } = analysisResult;
    const truncatedInsight = insight.length > 100 ? insight.slice(0, 100) + "..." : insight;

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center mb-2">
                    {faviconUrl && (
                        <Image
                            src={faviconUrl}
                            alt="Favicon"
                            width={32}
                            height={32}
                            className="rounded-full mr-2"
                        />
                    )}
                    <CardTitle>{title}</CardTitle>
                </div>
                <p className="text-sm text-muted-foreground">{url}</p>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{truncatedInsight}</p>
                <p className="text-xs text-muted-foreground mt-2">
                    {createdAt
                        ? formatDistanceToNow(new Date(createdAt), {
                            addSuffix: true,
                            locale: ptBR,
                        })
                        : "Data desconhecida"}
                </p>
                <Link href={`/analises/${id}`}>
                    <Button className="mt-4 cursor-pointer" variant="outline">
                        Ver Análise
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
