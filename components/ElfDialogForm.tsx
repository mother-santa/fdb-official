import { Dialog } from "@radix-ui/react-dialog";
import { Pen } from "lucide-react";
import { ElfCreationForm } from "./ElfCreationForm";
import { Button } from "./ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

export const ElfDialogForm = ({
    isOpen,
    setIsOpen,
    triggerButtonHidden
}: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    triggerButtonHidden?: boolean;
}) => {
    return (
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
                    <DialogTitle>Comment s'appelle ton lutin</DialogTitle>
                    <DialogDescription>Pour poster une bêtise, présente-nous ton lutin !</DialogDescription>
                </DialogHeader>
                <ElfCreationForm setIsOpen={setIsOpen} />
            </DialogContent>
        </Dialog>
    );
};
