export interface Comment {
    id: string;
    postId: string;
    userId: string;
    username: string;
    userAvatar: string;
    content: string;
    likeCount: number;
    likedByUserIds: string[];
    replies: Comment[];
    createdAt: Date;
}
