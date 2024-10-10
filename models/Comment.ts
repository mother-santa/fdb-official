export interface Comment {
    id: string;
    postId: string;
    userId: string;
    content: string;
    createdAt: Date;
    parentCommentId?: string;
    likeCount: number;
    likedByUserIds: string[];
}
