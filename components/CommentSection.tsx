import { Comment } from "@/models";
import { useState } from "react";
import { CommentCard } from "./CommentCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const CommentSection = ({ comments }: { comments: Comment[] }) => {
    const [newComment, setNewComment] = useState<string>("");

    // if (parentId === null) {
    //     setComments([...comments, newCommentObj])
    // } else {
    //     const addReply = (comment: Comment): Comment => {
    //     if (comment.id === parentId) {
    //         return { ...comment, replies: [...comment.replies, newCommentObj] }
    //     }
    //     return { ...comment, replies: comment.replies.map(addReply) }
    //     }
    //     setComments(comments.map(addReply))
    // }

    const addComment = (content: string) => {};

    const toggleLike = (commentId: number) => {
        //   const username = 'Current User'
        //   const updateLikes = (comment: Comment): Comment => {
        //     if (comment.id === commentId) {
        //       const likedBy = comment.likedBy.includes(username)
        //         ? comment.likedBy.filter(user => user !== username)
        //         : [...comment.likedBy, username]
        //       return { ...comment, likedBy }
        //     }
        //     return { ...comment, replies: comment.replies.map(updateLikes) }
        //   }
        //   setComments(comments.map(updateLikes))
    };

    return (
        <div className="space-y-4">
            <div className="h-[calc(100vh-12rem)] overflow-y-auto pr-4 -mr-4">
                {comments.map(comment => (
                    <CommentCard key={comment.id} comment={comment} onLike={toggleLike} onReply={author => setNewComment(`@${author} `)} />
                ))}
            </div>
            <div className="sticky bottom-0 bg-background pt-2">
                <div className="flex gap-2">
                    <Input placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} />
                    <Button onClick={() => addComment(newComment)}>Post</Button>
                </div>
            </div>
        </div>
    );
};
