"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/contexts";
import { Elf, Post } from "@/models";
import { createPost, uploadPostAssets } from "@/services/post.service";
import { updateUserProfile } from "@/services/userProfile.service";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { ChevronDown, Loader2, Pause, Play, Smile, Trash2, UserPlus } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { ElfCreationForm } from "./ElfCreationForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

export const PostCreationForm = ({
    setIsOpen,
    isNewElfOpen,
    setIsNewElfOpen
}: {
    setIsOpen: (isOpen: boolean) => void;
    isNewElfOpen: boolean;
    setIsNewElfOpen: (isOpen: boolean) => void;
}) => {
    const { currentElf, elves, clerkUser, loadUserProfile } = useAppContext();
    const [currentUser, setCurrentUser] = useState<Elf>(currentElf ?? elves[0]);
    const [description, setDescription] = useState("");
    const [playingVideo, setPlayingVideo] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    type FileWithPreview = File & { preview: string };
    const videoRefs = useRef<{ [key: number]: HTMLVideoElement }>({});

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    const handleDeleteFile = (index: number) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        if (playingVideo === index) {
            setPlayingVideo(null);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFiles = Array.from(e.dataTransfer.files).map(file => Object.assign(file, { preview: URL.createObjectURL(file) }));
        setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    if (!currentElf) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!clerkUser) {
            return;
        }
        setIsLoading(true);
        try {
            if (files.length === 0) {
                return;
            }
            const postData: Partial<Post> = {
                elfId: currentElf.id,
                elfeName: currentElf.name,
                elfeAvatarUrl: currentElf.avatarUrl,
                description,
                assets: []
            };
            const post = await createPost(clerkUser.id, postData);
            if (!post) {
                return;
            }
            await uploadPostAssets(clerkUser.id, currentElf.id, post.id, files);
            loadUserProfile?.();
        } catch (error) {
            console.error("Error creating post:", error);
        } finally {
            setIsLoading(false);
            setIsOpen(false);
            setDescription("");
            setFiles([]);
        }
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setDescription(prev => prev + emojiData.emoji);
    };

    const toggleVideoPlay = (index: number) => {
        const video = videoRefs.current[index];
        if (video) {
            if (playingVideo === index) {
                video.pause();
                setPlayingVideo(null);
            } else {
                if (playingVideo !== null) {
                    videoRefs.current[playingVideo]?.pause();
                }
                video.play();
                setPlayingVideo(index);
            }
        }
    };

    return (
        <>
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
                                <DropdownMenuItem
                                    key={elve.id}
                                    onSelect={() => {
                                        setCurrentUser(elve);
                                        updateUserProfile(clerkUser?.id ?? "", { currentElfId: elve.id });
                                        loadUserProfile?.();
                                    }}
                                >
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
                            <DropdownMenuItem onSelect={() => setIsNewElfOpen(true)}>
                                <UserPlus className="mr-2 h-5 w-5" />
                                Add New User
                            </DropdownMenuItem>
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
                                {file.type.startsWith("image/") ? (
                                    <img src={file.preview} alt={`Uploaded file ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                                ) : (
                                    <video
                                        ref={el => {
                                            if (el) videoRefs.current[index] = el;
                                        }}
                                        src={file.preview}
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                )}
                                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
                                    {file.type.startsWith("video/") && (
                                        <button
                                            type="button"
                                            onClick={() => toggleVideoPlay(index)}
                                            className="text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600 transition-colors mr-2"
                                            aria-label={playingVideo === index ? "Pause video" : "Play video"}
                                        >
                                            {playingVideo === index ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                                        </button>
                                    )}
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
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                        Annuler
                    </Button>
                    <Button type="submit">
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Enregistrement...
                            </>
                        ) : (
                            "Enregistrer"
                        )}
                    </Button>
                </div>
            </form>
            <Dialog open={isNewElfOpen} onOpenChange={setIsNewElfOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add New Elf</DialogTitle>
                    </DialogHeader>
                    <ElfCreationForm setIsOpen={setIsNewElfOpen} />
                </DialogContent>
            </Dialog>
        </>
    );
};
