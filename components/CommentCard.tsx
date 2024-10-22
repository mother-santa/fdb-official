import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Comment } from "@/models";
import { Heart } from "lucide-react";

export const CommentCard = ({
    comment,
    onLike,
    onReply,
    depth = 0
}: {
    comment: Comment;
    onLike: (id: number) => void;
    onReply: (author: string) => void;
    depth?: number;
}) => {
    if (!comment) {
        return null;
    }
    return (
        <div className={`pl-${depth * 4} border-l-2 border-muted-foreground/20`}>
            <div className="flex items-start space-x-4 p-4">
                <Avatar className="w-8 h-8">
                    <AvatarFallback>{comment.username}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{comment.username}</p>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => onLike(comment.id)}>
                            <Heart className={`w-4 h-4 ${comment.likedByUserIds?.length > 0 ? "fill-primary text-primary" : ""}`} />
                            <span className="ml-1 text-xs">{comment.likedByUserIds?.length}</span>
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                    <div className="flex items-center space-x-2 text-xs">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary px-0" onClick={() => onReply(comment.author)}>
                            Reply
                        </Button>
                    </div>
                </div>
            </div>
            {comment.replies?.map(reply => (
                <CommentCard key={reply.id} comment={reply} onLike={onLike} onReply={onReply} depth={depth + 1} />
            ))}
        </div>
    );
};
