import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export const TestWarning = () => {
    if (!process.env.NEXT_PUBLIC_EARLY_CTA) {
        return <></>;
    }
    return (
        <Alert variant="destructive" className="max-w-2xl mx-auto my-4">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Attention : Contenu Temporaire</AlertTitle>
            <AlertDescription>
                Tout le contenu publié actuellement est temporaire et utilisé uniquement à des fins de test. L'ensemble des données sera effacé lors du
                lancement officiel de la plateforme.
            </AlertDescription>
        </Alert>
    );
};
