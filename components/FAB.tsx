"use client";

import { useAppContext } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@radix-ui/react-dialog";
import { Loader2, Pen, Upload, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

export const FAB = () => {
    const { userProfile } = useAppContext();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [nickname, setNickname] = useState<string>("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isPublic, setIsPublic] = useState<boolean>(false);
    const [isCreatingProfile, setIsCreatingProfile] = useState<boolean>(false);
    const { toast } = useToast();

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setPhoto(null);
        setPhotoPreview(null);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsCreatingProfile(true);
        setTimeout(() => {
            setIsCreatingProfile(false);
            // setIsOpen(false);
        }, 2000);
    };
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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nickname">Nom du lutin</Label>
                            <Input id="nickname" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Enter your nickname" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Photo du lutin</Label>
                            {photoPreview ? (
                                <div className="relative w-32 h-32 mx-auto">
                                    <img src={photoPreview} alt="Profile preview" className="w-full h-full object-cover rounded-full" />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-0 right-0 rounded-full"
                                        onClick={handleRemovePhoto}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center w-32 h-32 mx-auto border-2 border-dashed border-gray-300 rounded-full">
                                    <label htmlFor="photo-upload" className="cursor-pointer">
                                        <Upload className="h-8 w-8 text-gray-400" />
                                        <span className="sr-only">Envoyer une photo</span>
                                    </label>
                                    <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="public-profile" checked={isPublic} onCheckedChange={setIsPublic} />
                            <Label htmlFor="public-profile">Les photos de mon lutin seront publiques</Label>
                        </div>

                        <Button type="submit" className="w-full" disabled={isCreatingProfile} onClick={handleSubmit}>
                            {isCreatingProfile ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                "Enregistrer"
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        )
    );
};
