"use client";

import { useAppContext } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { updatePostLike } from "@/lib/firebase";
import { Post } from "@/models";
import { SignInButton } from "@clerk/nextjs";
import { ToastAction } from "@radix-ui/react-toast";
import { CountUp } from "countup.js";
import { formatDistanceToNow } from "date-fns";
import { fr as frLocale } from "date-fns/locale";
import { Timestamp } from "firebase/firestore";
import { kebabCase } from "lodash";
import { ChevronLeft, ChevronRight, MessageSquare, ThumbsUp } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

interface PostCardProps {
    post?: Post;
    className?: string;
}

export const PostCard = ({ post, className = "" }: PostCardProps) => {
    const [currentAsset, setCurrentAsset] = useState(0);
    const { toast } = useToast();
    const { clerkUser } = useAppContext();
    const isLiked = post && (post.likedByUserIds || []).includes(clerkUser?.id || "");
    const [isVisible, setIsVisible] = useState(false);
    const [isLikeCountHidden, setIsLikeCountHidden] = useState(false);
    const [odLikeCount, setOldLikeCount] = useState(0);
    const cardRef = useRef(null);
    const key = kebabCase(post?.description + "likes");

    useEffect(() => {
        setIsLikeCountHidden(!post?.likedByUserIds?.length);
        const count = new CountUp(key, post?.likedByUserIds?.length || 0, { duration: 0.4, startVal: odLikeCount });
        count.start();
        setTimeout(() => {
            setOldLikeCount(post?.likedByUserIds?.length || 0);
        }, 400);
    }, [post?.likedByUserIds]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isVisible) {
            timer = setTimeout(() => {
                // const count = new CountUp(key, post?.likedByUserIds?.length || 0);
                // count.start();
            }, 100); // Délai de 500ms
        } else {
            // const count = new CountUp(key, 0);
            // count.start();
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [isVisible]);

    if (!post) {
        return null;
    }

    const nextImage = () => {
        setCurrentAsset(prev => (prev + 1) % post.assets.length);
    };

    const prevImage = () => {
        setCurrentAsset(prev => (prev - 1 + post.assets.length) % post.assets.length);
    };

    const displayNotConnectedToast = () => {
        toast({
            variant: "destructive",
            title: "Whooooo",
            description: "Tu devrais peut-être te connecter pour intéragir avec ce post !",
            action: (
                <SignInButton>
                    <ToastAction altText="Me connecter">Me connecter</ToastAction>
                </SignInButton>
            )
        });
    };

    const handleLikeClick = () => {
        if (!clerkUser) {
            displayNotConnectedToast();
            return;
        }
        updatePostLike(clerkUser.id, post.id);
    };

    const handleCommentClick = () => {
        if (!clerkUser) {
            displayNotConnectedToast();
            return;
        }
    };

    const formatCreatedAt = (createdAt: Timestamp | Date | null | undefined) => {
        if (createdAt instanceof Timestamp) {
            return formatDistanceToNow(createdAt.toDate(), { addSuffix: true, locale: frLocale });
        } else if (createdAt instanceof Date && !isNaN(createdAt.getTime())) {
            return formatDistanceToNow(createdAt, { addSuffix: true, locale: frLocale });
        } else {
            return "Date inconnue";
        }
    };

    return (
        <Card ref={cardRef} className={`w-full max-w-md mx-auto ${className} !px-0`}>
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="w-12 h-12">
                    <AvatarImage src={post?.elfeAvatarUrl} alt={post?.elfeName || "lutin anonyme"} />
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
                    <p className="text-sm text-muted-foreground">{formatCreatedAt(post.createdAt)}</p>{" "}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-semibold">{post?.description || "Pas de contenu"}</h3>
                </div>
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    {post.assets.map((asset, index) => {
                        if (index === currentAsset) {
                            if (asset.type === "image") {
                                return (
                                    <Image
                                        key={index}
                                        src={asset.url}
                                        alt={`photo - ${post?.description || "Pas de contenu"}`}
                                        height={400}
                                        width={600}
                                        style={{ objectFit: "cover", maxHeight: 400 }}
                                        className="bg-slate-200/50"
                                    />
                                );
                            }
                            if (asset.type === "video") {
                                return (
                                    <video
                                        key={index}
                                        src={asset.url}
                                        playsInline
                                        title={`video - ${post?.description || "Pas de contenu"}`}
                                        className="bg-slate-200/50 object-cover"
                                    />
                                );
                            }
                        }
                    })}
                    {post.assets.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-slate-500/80 text-white hover:bg-slate-500/70"
                                onClick={prevImage}
                                aria-label="image précédente"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-slate-500/80 text-white hover:bg-slate-500/70"
                                onClick={nextImage}
                                aria-label="image suivante"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="flex items-center gap-2"></div>
                <div className="flex gap-4">
                    <button className={`flex items-center gap-1 ${isLiked ? "text-success" : "text-muted-foreground"}`} onClick={handleLikeClick}>
                        <ThumbsUp className="w-5 h-5" />
                        <span className="text-sm">Like</span>
                        {!!post.likedByUserIds?.length && !isLikeCountHidden && (
                            <>
                                (<span id={key}></span>)
                            </>
                        )}
                    </button>
                    <button className="flex items-center gap-1 text-muted-foreground" onClick={handleCommentClick}>
                        <MessageSquare className="w-5 h-5" />
                        <span className="text-sm">Comment</span>
                    </button>
                </div>
            </CardFooter>
        </Card>
    );
};
