import { COMMENT_COLLECTION, POST_COLLECTION } from "@/constants";
import { db } from "@/lib/firebase";
import { addDoc, collection, doc, getDoc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore";
import { Comment } from "../models";

export const createComment = async (userId: string, postId: string, data: Partial<Comment>, commentId?: string) => {
    try {
        if (commentId && commentId !== "") {
            const parentComment = await fetchComment(postId, commentId);
            if (parentComment) {
                await updateComment(postId, commentId, { replies: [...parentComment.replies, data as Comment] });
                return { id: commentId, ...data, replies: [...parentComment.replies, data as Comment] } as Comment;
            }
        } else {
            const commentCollection = collection(db, POST_COLLECTION, postId, COMMENT_COLLECTION);
            const newComment = await addDoc(commentCollection, {
                userId,
                createdAt: new Date(),
                ...data
            });
            return { id: newComment.id, ...data } as Comment;
        }
    } catch (error) {
        console.error("Error creating comment:", error);
        return null;
    }
};

export const fetchComment = async (postId: string, commentId: string): Promise<Comment | null> => {
    try {
        const commentDoc = await getDoc(doc(db, POST_COLLECTION, postId, COMMENT_COLLECTION, commentId));
        if (commentDoc.exists()) {
            return commentDoc.data() as Comment;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching comment:", error);
        return null;
    }
};

export const updateComment = async (postId: string, commentId: string, data: Partial<Comment>) => {
    try {
        const commentDoc = doc(db, POST_COLLECTION, postId, COMMENT_COLLECTION, commentId);
        await setDoc(commentDoc, data, { merge: true });
    } catch (error) {
        console.error("Error updating comment:", error);
    }
};

export const listenToPostComments = (postId: string, onChange: (cmts: Comment[]) => void) => {
    const commentCollection = collection(db, POST_COLLECTION, postId, COMMENT_COLLECTION);
    const commentQuery = query(commentCollection, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(commentQuery, async commentSnapshot => {
        const comments: Comment[] = commentSnapshot.docs.map(
            doc =>
                ({
                    id: doc.id,
                    ...doc.data()
                } as Comment)
        );
        onChange(comments);
    });

    return unsubscribe;
};
