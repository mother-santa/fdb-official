"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAppContext } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { formatCreatedAt } from "@/lib/utils";
import { Comment, Post } from "@/models";
import { listenToPostComments } from "@/services/comment.service";
import { updatePostLike } from "@/services/post.service";
import { updateUserProfile } from "@/services/userProfile.service";
import { SignInButton } from "@clerk/nextjs";
import { ToastAction } from "@radix-ui/react-toast";
import { CountUp } from "countup.js";
import { kebabCase } from "lodash";
import { ChevronLeft, ChevronRight, Edit, Flag, Loader2, MessageCircle, MoreVertical, Star, ThumbsUp, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CommentSection } from "./CommentSection";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

interface PostCardProps {
    post?: Post;
    className?: string;
}

export const PostCard = ({ post, className = "" }: PostCardProps) => {
    const [currentAsset, setCurrentAsset] = useState(0);
    const { toast } = useToast();
    const { clerkUser, userProfile, loadUserProfile } = useAppContext();
    const isLiked = post && (post.likedByUserIds || []).includes(clerkUser?.id || "");
    const [, setIsVisible] = useState(false);
    const [odLikeCount, setOldLikeCount] = useState(0);
    const cardRef = useRef(null);
    const key = kebabCase(post?.description + "likes");
    const [comments, setComments] = useState<Comment[]>([]);
    const [isFavorite] = useState(false);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const isCurrentUserOwner = post?.ownerId === clerkUser?.id;
    const [isReportingLoading, setIsReportingLoading] = useState(false);

    useEffect(() => {
        if (!post) {
            return;
        }
        const fetchPosts = async () => {
            const unsubscribe = listenToPostComments(post?.id, data => {
                setComments(data);
            });
            return () => unsubscribe();
        };
        fetchPosts();
    }, [post]);

    useEffect(() => {
        const count = new CountUp(key, post?.likedByUserIds?.length || 0, { duration: 0.4, startVal: odLikeCount, prefix: "(", suffix: ")" });
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

    if (!post) {
        return null;
    }

    const toggleFavorite = async () => {
        setIsFavoriteLoading(true);
        if (userProfile?.favoritePostIds?.includes(post.id)) {
            await updateUserProfile(clerkUser?.id || "", { favoritePostIds: userProfile.favoritePostIds.filter(id => id !== post.id) });
        } else {
            await updateUserProfile(clerkUser?.id || "", { favoritePostIds: [...(userProfile?.favoritePostIds ?? []), post.id] });
        }
        await loadUserProfile?.();
        setIsFavoriteLoading(false);
    };

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

    const handleReport = async () => {
        setIsReportingLoading(true);
        if (!userProfile?.favoritePostIds?.includes(post.id)) {
            await updateUserProfile(clerkUser?.id || "", { reportedPostIds: [...(userProfile?.reportedPostIds ?? []), post.id] });
        }
        await loadUserProfile?.();
        setIsReportingLoading(false);
        toast({
            variant: "destructive",
            title: "Merci !",
            description: "Ce post a été signalé à l'équipe de modération"
        });
    };

    const handleEdit = () => {
        // Implement edit logic here
        console.log("Edit post");
    };

    const handleDelete = () => {
        // Implement delete logic here
        console.log("Delete post");
    };

    if (userProfile?.reportedPostIds?.includes(post.id)) {
        return <></>;
    }

    return (
        <Card ref={cardRef} className={`w-full max-w-md mx-auto ${className} !px-0`}>
            <CardHeader className="flex flex-row justify-between items-center gap-4 w-full">
                <div className="flex flex-row justify-between items-center gap-4">
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
                </div>
                <div className="flex items-center justify-end gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`text-muted-foreground ${isFavorite ? "text-yellow-400 hover:text-yellow-500" : "hover:text-yellow-400"}`}
                        onClick={toggleFavorite}
                        disabled={isFavoriteLoading}
                    >
                        {!isFavoriteLoading ? (
                            <>
                                <Star className={`h-5 w-5 ${userProfile?.favoritePostIds?.includes(post.id) ? "text-yellow-400" : "text-muted-foreground"}`} />
                                <span className="sr-only">
                                    {userProfile?.favoritePostIds?.includes(post.id) ? "Remove from favorites" : "Add to favorites"}
                                </span>
                            </>
                        ) : (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            </>
                        )}
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-5 w-5" />
                                <span className="sr-only">More options</span>
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
                        {!!post.likedByUserIds?.length && <span id={key}></span>}
                    </button>
                </div>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" className="text-muted-foreground" onClick={() => handleCommentClick}>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Comment
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="h-auto max-h-[66vh] sm:max-w-2xl sm:mx-auto overflow-y-auto py-0">
                        <SheetHeader className="py-4 fixed z-50 bg-background sm:max-w-2xl sm:mx-auto">
                            <SheetTitle>Comments</SheetTitle>
                        </SheetHeader>
                        <div className="mt-10">
                            <CommentSection comments={comments} postId={post.id} />
                        </div>
                    </SheetContent>
                </Sheet>
            </CardFooter>
        </Card>
    );
};
