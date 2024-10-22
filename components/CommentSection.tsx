import { useAppContext } from "@/contexts";
import { useToast } from "@/hooks/use-toast";
import { createComment } from "@/lib/firebase";
import { Comment } from "@/models";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Smile } from "lucide-react";
import { useState } from "react";
import { CommentCard } from "./CommentCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const CommentSection = ({ postId, comments }: { postId: string; comments: Comment[] }) => {
    const [newComment, setNewComment] = useState<string>("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { clerkUser } = useAppContext();
    const { toast } = useToast();

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setNewComment(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const addComment = (content: string) => {
        if (!clerkUser) {
            return;
        }
        if (content.trim() === "") {
            return;
        }
        console.log(content);
        try {
            createComment(clerkUser?.id, postId, { content });
            setNewComment("");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Whoops",
                description: "Une erreur s'est produite lors de la création du commentaire"
            });
            console.error("Error creating comment:", error);
        }
        setNewComment("");
    };

    const toggleLike = (id: number) => {};

    return (
        <div className="space-y-4">
            <div className="h-[calc(100vh-12rem)] overflow-y-auto pr-4 -mr-4">
                {comments.map(comment => (
                    <CommentCard key={comment.id} comment={comment} onLike={toggleLike} onReply={author => setNewComment(`@${author} `)} />
                ))}
            </div>
            <div className="sticky bottom-0 bg-background pt-2">
                <div className="flex gap-2 relative">
                    <Input placeholder="Add a comment..." value={newComment} onChange={e => setNewComment(e.target.value)} />
                    <Button variant="outline" size="icon" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                        <Smile className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => addComment(newComment)}>Post</Button>
                    {showEmojiPicker && (
                        <div className="absolute right-0 bottom-12">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
