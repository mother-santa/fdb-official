"use client";

import { useAppContext } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { Pen } from "lucide-react";
import { Button } from "./ui/button";

export const FAB = () => {
    const { userProfile } = useAppContext();
    const { toast } = useToast();

    const handleFabClick = () => {
        toast({
            title: "Presque !!!",
            description: "Tu dois d'abord enregistrer ton lutin avant de publier",
            action: <ToastAction altText="Créer mon lutin">Créer mon lutin</ToastAction>
        });
    };
    return (
        userProfile && (
            <Button className="fixed right-4 bottom-4 rounded-full w-14 h-14 shadow-lg" size="icon" aria-label="Create new item" onClick={handleFabClick}>
                <Pen className="h-6 w-6" />
            </Button>
        )
    );
};
