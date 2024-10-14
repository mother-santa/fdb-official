import { ElfCreationForm } from "./ElfCreationForm";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";

export const ElfDialogForm = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
