import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatCreatedAt } from "@/lib/utils";
import { Comment } from "@/models";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Heart, Reply } from "lucide-react";

export const CommentCard = ({
    comment,
    onLike,
    onReply,
    depth = 0
}: {
    comment: Comment;
    onLike: (id: string) => void;
    onReply: (commentId: string, author: string) => void;
    depth?: number;
}) => {
    if (!comment) {
        return null;
    }
    return (
        <div className={`pl-8 border-l-${depth ? "0" : "2"} border-muted-foreground/20`}>
            <div className="flex items-start space-x-4 p-4">
                <Avatar className="w-6 h-6 my-1">
                    <AvatarImage className="rounded-full" src={comment?.userAvatar} alt={comment?.username ?? "?"} />
                    <AvatarFallback>
                        {(comment?.username ?? "?")
                            .split(" ")
                            .map(name => name[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">{comment.username}</p>
                            <p className="text-xs text-muted-foreground">{formatCreatedAt(comment.createdAt)}</p>
                        </div>
                        {!depth && (
                            <div className="flex flex-row-reverse">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary" onClick={() => onLike(comment.id)}>
                                    <Heart className={`w-4 h-4 ${comment.likedByUserIds?.length > 0 ? "fill-primary text-primary" : ""}`} />
                                    <span className="ml-1 text-xs">{comment.likedByUserIds?.length}</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-primary px-1 mx-1"
                                    onClick={() => onReply(comment.id, comment.username)}
                                >
                                    <span className="mr-1 text-xs">Répondre</span>
                                    <Reply className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
            </div>
            {comment.replies?.map(reply => (
                <CommentCard key={reply.id} comment={reply} onLike={onLike} onReply={onReply} depth={depth + 1} />
            ))}
        </div>
    );
};
