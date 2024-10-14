import { Button } from "@/components/ui/button";
import { useAppContext } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { checkUserSlugIsAvailable, updateUserProfile, updateUserProfilePhoto } from "@/lib/firebase";
import { kebabCase } from "lodash";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

export const ProfileDialogForm = ({
    isOpen,
    setIsOpen,
    triggerButtonHidden
}: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    triggerButtonHidden?: boolean;
}) => {
    const { toast } = useToast();
    const [nickname, setNickname] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [isCreatingProfile, setIsCreatingProfile] = useState(false);
    const { clerkUser, loadUserProfile } = useAppContext();

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
        if (!clerkUser) {
            setIsCreatingProfile(false);
            return;
        }
        const slug = kebabCase(nickname);
        const slugIsUnique = await checkUserSlugIsAvailable(slug);
        if (!slugIsUnique) {
            toast({
                variant: "destructive",
                title: "Whoops",
                description: "Ce pseudo est déjà pris"
            });
            setIsCreatingProfile(false);
            return;
        }
        if (slug.length < 4) {
            toast({
                variant: "destructive",
                title: "Whoops",
                description: "Le pseudo doit contenir au moins 4 caractères"
            });
            setIsCreatingProfile(false);
            return;
        }

        try {
            if (photo) {
                await updateUserProfilePhoto(clerkUser?.id, photo);
            }

            await updateUserProfile(clerkUser.id, {
                slug,
                username: nickname,
                email: clerkUser.emailAddresses[0].emailAddress,
                termsAccepted: acceptTerms,
                createdAt: new Date() // communicationPreferences: {
                //     notificationEmails: true,
                //     newsletterEmails: true,
                //     partnerEmails: true
                // }
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreatingProfile(false);
        }

        setIsOpen(false);

        toast({
            title: "Bravo !!!",
            description: "Votre profil a été créé avec succès"
        });
        loadUserProfile?.();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            {!triggerButtonHidden && (
                <DialogTrigger asChild>
                    <Button className="w-full">Remplir mon profil</Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Remplis ton profil</DialogTitle>
                    <DialogDescription>Personnalise ton compte pour profiter pleinement de l'application.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nickname">Quel est ton nom d'utilisateur ?</Label>
                        <Input id="nickname" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Nom d'utilisateur" required />
                    </div>
                    <div className="space-y-2">
                        <Label>Tu as une photo de profil ?</Label>
                        {photoPreview ? (
                            <div className="relative w-32 h-32 mx-auto">
                                <Image src={photoPreview} alt="Profile preview" className="w-full h-full object-cover rounded-full" height={128} width={128} />
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
                                    <span className="sr-only">Charger une photo</span>
                                </label>
                                <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                            </div>
                        )}
                    </div>
                    <Separator />
                    <div className="flex items-center space-x-2">
                        <Switch id="terms" checked={acceptTerms} onCheckedChange={checked => setAcceptTerms(checked as boolean)} required />
                        <Label htmlFor="terms">J'accepte les conditions d'utilisation</Label>
                    </div>
                    <Button type="submit" className="w-full" disabled={isCreatingProfile || !acceptTerms} onClick={handleSubmit}>
                        {isCreatingProfile ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            "Enregistrer mon profil"
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};
