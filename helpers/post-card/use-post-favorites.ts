import { useAppContext } from "@/contexts";
import { Post } from "@/models";
import { updateUserProfile } from "@/services/userProfile.service";
import { useState } from "react";
import { useAuthenticatedAction } from "./use-authenticated-action";

export const usePostFavorites = (post?: Post) => {
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
    const { clerkUser, userProfile, loadUserProfile } = useAppContext();
    const { handleAuthenticatedAction } = useAuthenticatedAction();

    const toggleFavorite = async () => {
        handleAuthenticatedAction(async () => {
            if (!post || !clerkUser) return;

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
        });
    };

    return {
        isFavoriteLoading,
        toggleFavorite
    };
};
