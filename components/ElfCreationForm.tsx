import { useAppContext } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { checkElfSlugIsAvailable, createElf, updateElfPhoto } from "@/lib/firebase";
import { kebabCase } from "lodash";
import { Loader2, Lock, LockOpen, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";

export const ElfCreationForm = ({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) => {
    const [nickname, setNickname] = useState<string>("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [isPublic, setIsPublic] = useState<boolean>(true);
    const [isCreatingProfile, setIsCreatingProfile] = useState<boolean>(false);
    const { toast } = useToast();
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
        const slugIsUnique = await checkElfSlugIsAvailable(slug);
        if (!slugIsUnique) {
            toast({
                variant: "destructive",
                title: "Whoops",
                description: "Ce pseudo de lutin est déjà pris"
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
                await updateElfPhoto(clerkUser?.id, slug, photo);
            }
            await createElf(clerkUser?.id, {
                slug,
                name: nickname,
                isPrivate: !isPublic,
                createdAt: new Date()
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsCreatingProfile(false);
        }

        setIsOpen(false);

        toast({
            title: "Bravo !!!",
            description: "Votre lutin a été créé avec succès"
        });

        loadUserProfile?.();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="nickname">Nom du lutin</Label>
                <Input id="nickname" value={nickname} onChange={e => setNickname(e.target.value)} placeholder="Nom du lutin" required />
            </div>
            <div className="space-y-2">
                <Label>Photo du lutin</Label>
                {photoPreview ? (
                    <div className="relative w-32 h-32 mx-auto">
                        <Image src={photoPreview} alt="Profile preview" className="w-full h-full object-cover rounded-full" height={128} width={128} />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-0 right-0 rounded-full" onClick={handleRemovePhoto}>
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
            <Separator />
            <div className="bg-slate-100/70 p-4 rounded-md">
                <div className="pb-2">
                    <Alert variant={isPublic ? "info" : "warning"}>
                        {isPublic ? <LockOpen className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                        <AlertTitle className="font-bold">Soit prudent !</AlertTitle>
                        <AlertDescription>
                            {isPublic
                                ? "La totalité des publications de ton lutin seront accessibles à tous !"
                                : "Seuls les abonnés de ton lutin pourront voir tes publications. C'est dommage non ?"}
                        </AlertDescription>
                    </Alert>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="public-profile" checked={isPublic} onCheckedChange={() => setIsPublic(!isPublic)} />
                    <Label htmlFor="public-profile">Je souhaite que mes publications soient publiques</Label>
                </div>
            </div>
            <Separator />

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
    );
};
