"use client";

import { useAppContext } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { useClerk } from "@clerk/nextjs";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { ElfDialogForm } from "./ElfDialogForm";
import { PostCreationDialog } from "./PostCreationDialog";
import { ProfileDialogForm } from "./ProfileDialogForm";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export const NoPostCard = () => {
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
    const [isElfDialogOpen, setIsElfDialogOpen] = useState(false);
    const [isPostDialogOpen, setIsPostDialogOpen] = useState(false);
    const { toast } = useToast();
    const { clerkUser, userProfile, currentElf } = useAppContext();
    const clerk = useClerk();

    return (
        <>
            <Card className="w-full max-w-md mx-auto mt-8">
                <CardHeader>
                    <CardTitle className="text-center">C'est ultra calme ici...</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                    <p className="text-center text-muted-foreground">Les lutins sont un peu calmes, pourquoi ne pas être le premier à poster ?</p>
                    <Button
                        className="flex items-center space-x-2"
                        onClick={() => {
                            if (!clerkUser) {
                                toast({
                                    title: "Connectez-vous pour poster un message",
                                    description: "Vous devez être connecté pour poster un message",
                                    action: (
                                        <Button
                                            onClick={() => {
                                                clerk.openSignIn({});
                                            }}
                                        >
                                            Se connecter
                                        </Button>
                                    )
                                });
                            }

                            if (clerkUser && !userProfile) {
                                toast({
                                    title: "Vous devez remplir votre profil pour pouvoir poster un message",
                                    description: "Pour remplir votre profil, cliquez sur le bouton ci-dessous.",
                                    action: (
                                        <Button
                                            onClick={() => {
                                                setIsProfileDialogOpen(true);
                                            }}
                                        >
                                            Se connecter
                                        </Button>
                                    )
                                });
                            }

                            if (clerkUser && userProfile && !currentElf) {
                                setIsElfDialogOpen(true);
                            }

                            if (clerkUser && userProfile && currentElf) {
                                setIsPostDialogOpen(true);
                            }
                        }}
                    >
                        <PlusCircle className="w-4 h-4" />
                        <span>Poster un message</span>
                    </Button>
                </CardContent>
            </Card>
            <ProfileDialogForm isOpen={isProfileDialogOpen} setIsOpen={setIsProfileDialogOpen} triggerButtonHidden />
            <ElfDialogForm isOpen={isElfDialogOpen} setIsOpen={setIsElfDialogOpen} triggerButtonHidden />
            <PostCreationDialog isOpen={isPostDialogOpen} setIsOpen={setIsPostDialogOpen} triggerButtonHidden />
        </>
    );
};
