"use client";

import { useAppContext } from "@/contexts";
import { Pen } from "lucide-react";
import { useState } from "react";
import { PostCreationForm } from "./PostCreationForm";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export const PostCreationDialog = ({
    isOpen,
    setIsOpen,
    triggerButtonHidden
}: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    triggerButtonHidden?: boolean;
}) => {
    const { currentElf } = useAppContext();
    const [isNewElfOpen, setIsNewElfOpen] = useState(false);
    if (!currentElf) return null;
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                {!triggerButtonHidden && (
                    <DialogTrigger asChild>
                        <Button
                            className="fixed right-4 bottom-4 rounded-full w-14 h-14 shadow-lg bg-slate-500"
                            size="icon"
                            aria-label="Créer une publication"
                            onClick={() => setIsOpen(true)}
                        >
                            <Pen className="h-6 w-6 " />
                        </Button>
                    </DialogTrigger>
                )}
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Encore une bêtise ?</DialogTitle>
                        <DialogDescription>Allez, fais nous profiter !</DialogDescription>
                    </DialogHeader>
                    <PostCreationForm setIsOpen={setIsOpen} isNewElfOpen={isNewElfOpen} setIsNewElfOpen={setIsNewElfOpen} />
                </DialogContent>
            </Dialog>
        </>
    );
};
