export interface Post {
    id: string;
    elfId: string;
    elfeName: string;
    elfeAvatarUrl: string;
    imageUrl: string;
    description: string;
    likeCount: number;
    likedByUserIds: string[];
    isPrivate: boolean;
    createdAt: Date;
}
