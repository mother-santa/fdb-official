import { useAppContext } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { Comment, Post } from "@/models";
import { listenToPostComments } from "@/services/comment.service";
import { deletePost, updatePostLike } from "@/services/post.service";
import { updateUserProfile } from "@/services/userProfile.service";
import { SignInButton } from "@clerk/nextjs";
import { ToastAction } from "@radix-ui/react-toast";
import { CountUp } from "countup.js";
import { useEffect, useState } from "react";

export const usePostCard = (post?: Post) => {
    const [currentAsset, setCurrentAsset] = useState(0);
    const [comments, setComments] = useState<Comment[]>([]);
    const [isReporting, setIsReporting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const [oldLikeCount, setOldLikeCount] = useState(0);

    const { toast } = useToast();
    const { clerkUser, userProfile, loadUserProfile } = useAppContext();

    const isLiked = post && (post.likedByUserIds || []).includes(clerkUser?.id || "");
    const isCurrentUserOwner = post?.ownerId === clerkUser?.id;

    useEffect(() => {
        if (!post) return;

        const unsubscribe = listenToPostComments(post.id, data => {
            setComments(data);
        });

        return () => unsubscribe();
    }, [post]);

    const handleLikeAnimation = (key: string) => {
        const count = new CountUp(key, post?.likedByUserIds?.length || 0, {
            duration: 0.4,
            startVal: oldLikeCount,
            prefix: "(",
            suffix: ")"
        });
        count.start();
        setTimeout(() => {
            setOldLikeCount(post?.likedByUserIds?.length || 0);
        }, 400);
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
        if (!clerkUser || !post) {
            displayNotConnectedToast();
            return;
        }
        updatePostLike(clerkUser.id, post.id);
    };

    const toggleFavorite = async () => {
        if (!clerkUser || !post) {
            displayNotConnectedToast();
            return;
        }

        setIsFavoriteLoading(true);
        try {
            if (userProfile?.favoritePostIds?.includes(post.id)) {
                await updateUserProfile(clerkUser.id, {
                    favoritePostIds: userProfile.favoritePostIds.filter(id => id !== post.id)
                });
            } else {
                await updateUserProfile(clerkUser.id, {
                    favoritePostIds: [...(userProfile?.favoritePostIds ?? []), post.id]
                });
            }
            await loadUserProfile?.();
        } finally {
            setIsFavoriteLoading(false);
        }
    };

    const handleReport = async () => {
        if (!clerkUser || !post) return;

        setIsReporting(true);
        try {
            await updateUserProfile(clerkUser.id, {
                reportedPostIds: [...(userProfile?.reportedPostIds ?? []), post.id]
            });
            await loadUserProfile?.();
            toast({
                variant: "destructive",
                title: "Merci !",
                description: "Ce post a été signalé à l'équipe de modération"
            });
        } finally {
            setIsReporting(false);
        }
    };

    const handleDelete = async () => {
        if (!post) return;

        setIsDeleting(true);
        try {
            await deletePost(post.id);
            toast({
                variant: "destructive",
                title: "Merci !",
                description: "Ce post a été supprimé"
            });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleAssetNavigation = {
        next: () => setCurrentAsset(prev => (prev + 1) % (post?.assets.length || 1)),
        prev: () => setCurrentAsset(prev => (prev - 1 + (post?.assets.length || 1)) % (post?.assets.length || 1))
    };

    return {
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
    };
};
