"use client";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { Share2 } from "lucide-react";
import { useState } from "react";
import { FaFacebookF, FaPinterestP, FaTwitter } from "react-icons/fa";
import { IoLinkOutline } from "react-icons/io5";

interface ShareProps {
    title: string;
    url: string;
    postImage?: string;
}

export const ShareButtons = ({ title: postTitle, url: shareUrl, postImage }: ShareProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const encodedTitle = encodeURIComponent(postTitle);
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedImage = encodeURIComponent(postImage || "");

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            toast({
                title: "Link copied!",
                description: "The post link has been copied to your clipboard."
            });
            setIsOpen(false);
        });
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="w-9 h-9 rounded-full">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share post</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
                <div className="grid gap-4">
                    <h3 className="font-semibold text-center">Partager</h3>
                    <div className="flex justify-between">
                        <Button variant="outline" size="icon" onClick={() => window.open(shareLinks.facebook, "_blank")}>
                            <FaFacebookF className="h-4 w-4" />
                            <span className="sr-only">Sur Facebook</span>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => window.open(shareLinks.twitter, "_blank")}>
                            <FaTwitter className="h-4 w-4" />
                            <span className="sr-only">Sur Twitter</span>
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => window.open(shareLinks.pinterest, "_blank")}>
                            <FaPinterestP className="h-4 w-4" />
                            <span className="sr-only">Sur Pinterest</span>
                        </Button>
                        <Button variant="outline" size="icon" onClick={copyToClipboard}>
                            <IoLinkOutline className="h-4 w-4" />
                            <span className="sr-only">Copier le lien</span>
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};
