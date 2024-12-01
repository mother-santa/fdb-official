import { useAppContext } from "@/contexts";
import { Post } from "@/models";
import { useState } from "react";
import { useAuthenticatedAction } from "./use-authenticated-action";
import { usePostComments } from "./use-post-comments";
import { usePostFavorites } from "./use-post-favorites";
import { usePostLikes } from "./use-post-likes";
import { usePostModeration } from "./use-post-moderation";

export const usePostCard = (post?: Post) => {
    const [currentAsset, setCurrentAsset] = useState(0);
    const { clerkUser } = useAppContext();

    const { comments } = usePostComments(post);
    const { isLiked, handleLikeClick, handleLikeAnimation } = usePostLikes(post);
    const { isFavoriteLoading, toggleFavorite } = usePostFavorites(post);
    const { isReporting, isDeleting, handleReport, handleDelete } = usePostModeration(post);
    const { displayNotConnectedToast } = useAuthenticatedAction();

    const isCurrentUserOwner = post?.ownerId === clerkUser?.id;

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
