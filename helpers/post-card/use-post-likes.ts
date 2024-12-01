import { useAppContext } from "@/contexts";
import { Post } from "@/models";
import { updatePostLike } from "@/services/post.service";
import { CountUp } from "countup.js";
import { useState } from "react";
import { useAuthenticatedAction } from "./use-authenticated-action";

export const usePostLikes = (post?: Post) => {
    const { clerkUser } = useAppContext();
    const [oldLikeCount, setOldLikeCount] = useState(0);
    const { handleAuthenticatedAction } = useAuthenticatedAction();

    const isLiked = post && (post.likedByUserIds || []).includes(clerkUser?.id || "");

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

    const handleLikeClick = () => {
        handleAuthenticatedAction(() => {
            if (!post || !clerkUser) return;
            updatePostLike(clerkUser.id, post.id);
        });
    };

    return {
        isLiked,
        handleLikeClick,
        handleLikeAnimation
    };
};
