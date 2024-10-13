"use client";

import { useAppContext } from "@/contexts";
import { Dialog } from "@radix-ui/react-dialog";
import { Pen } from "lucide-react";
import { useState } from "react";
import { ProfileCreationForm } from "./ProfileCreationForm";
import { Button } from "./ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export const FAB = () => {
    const { userProfile } = useAppContext();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        userProfile && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="fixed right-4 bottom-4 rounded-full w-14 h-14 shadow-lg"
                        size="icon"
                        aria-label="Create new item"
                        onClick={() => setIsOpen(true)}
                    >
                        <Pen className="h-6 w-6" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Comment s'appelle ton lutin</DialogTitle>
                        <DialogDescription>Pour poster une bêtise, présente-nous ton lutin !</DialogDescription>
                    </DialogHeader>
                    <ProfileCreationForm setIsOpen={setIsOpen} />
                </DialogContent>
            </Dialog>
        )
    );
};
