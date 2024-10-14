export interface Post {
    id: string;
    elfId: string;
    elfeName: string;
    elfeAvatarUrl: string;
    imageUrl: string;
    description: string;
    createdAt: Date;
    likeCount: number;
    likedByUserIds: string[];
    isPrivate: boolean;
}
