"use client";

import { Post } from "@/models";
import { formatDistanceToNow } from "date-fns";
import { fr as frLocale } from "date-fns/locale";
import { ChevronLeft, ChevronRight, MessageSquare, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface PostCardProps {
    post?: Post;
    className?: string;
}

export const PostCard = ({ post, className = "" }: PostCardProps) => {
    const [currentImage, setCurrentImage] = useState(0);
    const images = ["/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600", "/placeholder.svg?height=400&width=600"];

    const nextImage = () => {
        setCurrentImage(prev => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImage(prev => (prev - 1 + images.length) % images.length);
    };

    return (
        <Card className={`w-full max-w-md mx-auto ${className} !px-0`}>
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="w-12 h-12">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt={post?.elfeName || "lutin anonyme"} />
                    <AvatarFallback>
                        {post?.elfeName
                            ? post.elfeName
                                  .split(" ")
                                  .map(name => name[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)
                            : "--"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <h2 className="text-lg font-semibold">{post?.elfeName || "lutin anonyme"}</h2>
                    <p className="text-sm text-muted-foreground">{formatDistanceToNow(post?.createdAt || new Date(), { addSuffix: true, locale: frLocale })}</p>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{post?.description || "Pas de contenu"}</h3>
                </div>
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                        src={images[currentImage]}
                        alt={`${post?.description || "Pas de contenu"} photo ${currentImage + 1}`}
                        height={400}
                        width={600}
                        style={{ objectFit: "cover", maxHeight: 400 }}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                        onClick={prevImage}
                        aria-label="image précédente"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                        onClick={nextImage}
                        aria-label="image suivante"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2"></div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                        <ThumbsUp className="w-5 h-5" />
                        <span className="text-sm">Like</span>
                    </button>
                    <button className="flex items-center gap-1 text-muted-foreground hover:text-primary">
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm">Comment</span>
                    </button>
                </div>
            </CardFooter>
        </Card>
    );
};
