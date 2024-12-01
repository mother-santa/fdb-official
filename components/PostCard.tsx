"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAppContext } from "@/contexts";
import { usePostCard } from "@/helpers/post-card/use-post-card";
import { formatCreatedAt } from "@/lib/utils";
import { Post } from "@/models";
import { kebabCase } from "lodash";
import { ChevronLeft, ChevronRight, Edit, Flag, Loader2, MessageCircle, MoreVertical, Star, ThumbsUp, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CommentSection } from "./CommentSection";
import { ShareButtons } from "./ShareButtons";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface PostCardProps {
    post?: Post;
    className?: string;
}

export const PostCard = ({ post, className = "" }: PostCardProps) => {
    const {
        currentAsset,
        comments,
        isReporting,
        isDeleting,
        isFavoriteLoading,
        isLiked,
        isCurrentUserOwner,
        handleLikeAnimation,
        displayNotConnectedToast,
        handleLikeClick,
        toggleFavorite,
        handleReport,
        handleDelete,
        handleAssetNavigation
    } = usePostCard(post);

    const { clerkUser, userProfile } = useAppContext();
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);
    const key = kebabCase(post?.description + "likes");

    useEffect(() => {
        handleLikeAnimation(key);
    }, [post?.likedByUserIds, key]);

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

    const handleCommentClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!clerkUser) {
            displayNotConnectedToast();
            e.preventDefault();
        }
        return true;
    };

    if (!post) {
        return null;
    }

    return (
        <Card ref={cardRef} className={`w-full max-w-[470px] mx-auto ${className} !px-0 overflow-hidden`} id={post.id}>
            <div className="relative">
                <div className="relative aspect-square w-full bg-slate-100">
                    {post.assets.map((asset, index) => {
                        if (index === currentAsset) {
                            if (asset.type === "image") {
                                return (
                                    <Image
                                        key={index}
                                        src={asset.url}
                                        alt={`photo - ${post?.description || "Pas de contenu"}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 470px) 100vw, 470px"
                                        priority={index === 0}
                                    />
                                );
                            }
                            if (asset.type === "video") {
                                return (
                                    <video
                                        key={index}
                                        src={asset.url}
                                        playsInline
                                        controls
                                        className="h-full w-full object-cover"
                                        title={`video - ${post?.description || "Pas de contenu"}`}
                                    />
                                );
                            }
                        }
                        return null;
                    })}
                    {post.assets.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/60 text-white"
                                onClick={handleAssetNavigation.prev}
                                aria-label="image précédente"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/60 text-white"
                                onClick={handleAssetNavigation.next}
                                aria-label="image suivante"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </>
                    )}
                </div>

                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 via-black/40 to-transparent">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8 ring-2 ring-white/50">
                                <AvatarImage src={post?.elfeAvatarUrl} alt={post?.elfeName || "lutin anonyme"} />
                                <AvatarFallback className="bg-white/10 text-white">
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
                                <h2 className="text-sm font-semibold leading-none text-white">{post?.elfeName || "lutin anonyme"}</h2>
                                <p className="text-xs text-white/80">{formatCreatedAt(post.createdAt)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className={`h-8 w-8 text-white hover:bg-black/20 ${
                                    userProfile?.favoritePostIds?.includes(post.id) ? "text-yellow-400 hover:text-yellow-500" : "hover:text-yellow-400"
                                }`}
                                onClick={toggleFavorite}
                                disabled={isFavoriteLoading}
                            >
                                {!isFavoriteLoading ? (
                                    <Star className={`h-4 w-4 ${userProfile?.favoritePostIds?.includes(post.id) ? "text-yellow-400" : "text-white"}`} />
                                ) : (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-black/20">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {isCurrentUserOwner ? (
                                        <>
                                            <DropdownMenuItem onClick={handleEdit}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit post
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={handleDelete}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete post
                                            </DropdownMenuItem>
                                        </>
                                    ) : (
                                        <DropdownMenuItem onClick={handleReport}>
                                            <Flag className="mr-2 h-4 w-4" />
                                            Report post
                                        </DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            <CardContent className="px-4 pt-3 pb-4 space-y-3">
                {/* Actions Row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            className={`flex items-center gap-1 hover:opacity-70 transition-opacity ${isLiked ? "text-success" : "text-foreground"}`}
                            onClick={handleLikeClick}
                        >
                            <ThumbsUp className="w-[22px] h-[22px]" />
                            {!!post.likedByUserIds?.length && <span id={key} className="text-sm font-medium"></span>}
                        </button>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-foreground hover:opacity-70 transition-opacity px-0"
                                    onClick={handleCommentClick}
                                >
                                    <MessageCircle className="w-[22px] h-[22px]" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[80vh] sm:max-w-2xl sm:mx-auto">
                                <SheetHeader>
                                    <SheetTitle>Comments</SheetTitle>
                                </SheetHeader>
                                <div className="mt-4">
                                    <CommentSection comments={comments} postId={post.id} />
                                </div>
                            </SheetContent>
                        </Sheet>
                        <ShareButtons title={post.description} url={`${process.env.NEXT_PUBLIC_APP_BASEURL}/#${post.id}`} />
                    </div>
                </div>

                {/* Description Section */}
                <div className="space-y-2">
                    {!!post.likedByUserIds?.length && (
                        <p className="text-sm font-medium">
                            {post.likedByUserIds.length} {post.likedByUserIds.length === 1 ? "like" : "likes"}
                        </p>
                    )}

                    <div className="text-sm">
                        <span className="font-semibold mr-2">{post?.elfeName || "lutin anonyme"}</span>
                        <span className="text-foreground/90">{post?.description || "Pas de contenu"}</span>
                    </div>

                    {comments.length > 0 && (
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="text-sm text-muted-foreground hover:text-muted-foreground/80 transition-colors" onClick={handleCommentClick}>
                                    View all {comments.length} comments
                                </button>
                            </SheetTrigger>
                            <SheetContent side="bottom" className="h-[80vh] sm:max-w-2xl sm:mx-auto">
                                <SheetHeader>
                                    <SheetTitle>Comments</SheetTitle>
                                </SheetHeader>
                                <div className="mt-4">
                                    <CommentSection comments={comments} postId={post.id} />
                                </div>
                            </SheetContent>
                        </Sheet>
                    )}

                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide">{formatCreatedAt(post.createdAt)}</p>
                </div>
            </CardContent>
        </Card>
    );
};
