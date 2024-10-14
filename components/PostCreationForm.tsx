"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/contexts";
import { Elf } from "@/models";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { ChevronDown, Smile, Trash2 } from "lucide-react";
import { useCallback, useState } from "react";

export const PostCreationForm = ({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) => {
    const { currentElf, elves } = useAppContext();
    if (!currentElf) return null;
    const [, setIsFormOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<Elf>(currentElf ?? elves[0]);
    const [description, setDescription] = useState("");
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files || [])]);
        }
    };

    const handleDeleteFile = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files);
        setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the data to your backend
        console.log("Submitting:", { user: currentUser, description, files });
        setIsFormOpen(false);
        setDescription("");
        setFiles([]);
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setDescription(prev => prev + emojiData.emoji);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild aria-label="Switch user">
                        <div className="relative cursor-pointer">
                            <Avatar className="cursor-pointer">
                                <AvatarImage src={currentElf?.avatarUrl} alt={currentUser.name} />
                                <AvatarFallback>
                                    {currentElf?.name
                                        .split(" ")
                                        .map(name => name[0])
                                        .join("")
                                        .toUpperCase()
                                        .slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <ChevronDown className="h-4 w-4 absolute bottom-0 right-0 text-gray-600 bg-white rounded-full" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {elves.map(elve => (
                            <DropdownMenuItem key={elve.id} onSelect={() => setCurrentUser(elve)}>
                                <Avatar className="mr-2 h-6 w-6">
                                    <AvatarImage src={elve.avatarUrl} alt={elve.name} />
                                    <AvatarFallback>
                                        {elve.name
                                            .split(" ")
                                            .map(name => name[0])
                                            .join("")
                                            .toUpperCase()
                                            .slice(0, 2)}
                                    </AvatarFallback>
                                </Avatar>
                                {elve.name}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <span className="font-medium">{currentElf?.name}</span>
            </div>
            <div
                className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => document.getElementById("file-upload")?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <input id="file-upload" type="file" multiple accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
                <p>Click or drag to upload photos or videos</p>
            </div>
            {files.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {files.map((file, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img src={URL.createObjectURL(file)} alt={`Uploaded file ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => handleDeleteFile(index)}
                                    className="text-white bg-red-500 p-2 rounded-full hover:bg-red-600 transition-colors"
                                    aria-label={`Delete file ${index + 1}`}
                                >
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="relative">
                <Textarea placeholder="What's on your mind?" value={description} onChange={e => setDescription(e.target.value)} className="pr-10" />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon" className="absolute bottom-2 right-2" aria-label="Add emoji">
                            <Smile className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                    Annuler
                </Button>
                <Button type="submit">Enregistrer</Button>
            </div>
        </form>
    );
};
