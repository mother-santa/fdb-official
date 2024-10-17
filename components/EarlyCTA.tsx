import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Construction, ExternalLink } from "lucide-react";
import Link from "next/link";

export const EarlyCTA = () => {
    if (!process.env.NEXT_PUBLIC_EARLY_CTA) {
        return <></>;
    }
    return (
        <Card className="w-full max-w-3xl mx-auto my-4">
            <CardHeader className="flex flex-row items-center gap-4">
                <Construction className="w-8 h-8 text-yellow-500" />
                <div>
                    <CardTitle>Application en développement</CardTitle>
                    <CardDescription>Suivez notre progression !</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                <p className="mb-4">
                    Cette application est actuellement en cours de développement. Nous travaillons dur pour vous offrir une expérience exceptionnelle !
                </p>
                <p className="mb-4">
                    Si vous souhaitez suivre l'avancement du projet ou même contribuer, nous vous invitons à rejoindre notre tableau Trello public.
                </p>
                <Button asChild>
                    <Link href="https://trello.com/b/dwvUGNGt/fait-des-betises" target="_blank" rel="noopener noreferrer" className="inline-flex items-center">
                        Rejoindre le Trello
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
};
