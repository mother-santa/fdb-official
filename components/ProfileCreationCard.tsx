"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppContext } from "@/contexts";
import { useState } from "react";
import { ProfileDialogForm } from "./ProfileDialogForm";

export const ProfileCreationCard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { clerkUser, userProfile } = useAppContext();

    return (
        clerkUser &&
        !userProfile && (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Remplis ton profil</CardTitle>
                    <CardDescription>Personnalise ton compte pour profiter pleinement de l'application.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileDialogForm isOpen={isOpen} setIsOpen={setIsOpen} />
                </CardContent>
            </Card>
        )
    );
};
