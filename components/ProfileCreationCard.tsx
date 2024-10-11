"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppUserContext } from "@/contexts";
import { Upload, X } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export const ProfileCreationCard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [nickname, setNickname] = useState("");
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const { clerkUser, userProfile } = useAppUserContext();

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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission here
        console.log({ nickname, photo, acceptTerms });
        setIsOpen(false);
    };

    console.log(clerkUser);

    return (
        clerkUser &&
        !userProfile && (
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Complete Your Profile</CardTitle>
                    <CardDescription>Personalize your account to get the most out of our platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="w-full">Update Profile</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Complete Your Profile</DialogTitle>
                                <DialogDescription>Fill in your details to personalize your account.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nickname">Nickname</Label>
                                    <Input
                                        id="nickname"
                                        value={nickname}
                                        onChange={e => setNickname(e.target.value)}
                                        placeholder="Enter your nickname"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Profile Photo</Label>
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
                                                <span className="sr-only">Upload photo</span>
                                            </label>
                                            <Input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="terms" checked={acceptTerms} onCheckedChange={checked => setAcceptTerms(checked as boolean)} required />
                                    <Label htmlFor="terms" className="text-sm">
                                        I accept the terms and conditions
                                    </Label>
                                </div>
                                <Button type="submit" className="w-full" disabled={!acceptTerms}>
                                    Save Profile
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        )
    );
};
