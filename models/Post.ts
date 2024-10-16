export interface PostItem {
    type: "image" | "video";
    url: string;
}

export interface Post {
    id: string;
    elfId: string;
    elfeName: string;
    elfeAvatarUrl: string;
    assets: PostItem[];
    description: string;
    likeCount: number;
    likedByUserIds: string[];
    isPrivate: boolean;
    createdAt: Date;
}
