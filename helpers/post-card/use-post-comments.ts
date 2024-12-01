import { Comment, Post } from "@/models";
import { listenToPostComments } from "@/services/comment.service";
import { useEffect, useState } from "react";

export const usePostComments = (post?: Post) => {
    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        if (!post) return;

        const unsubscribe = listenToPostComments(post.id, data => {
            setComments(data);
        });

        return () => unsubscribe();
    }, [post]);

    return { comments };
};
