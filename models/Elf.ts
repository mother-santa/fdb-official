export interface Elf {
    id: string;
    name: string;
    slug: string;
    description: string;
    avatarUrl: string;
    ownerId: string;
    isPrivate: boolean;
    dailyScore: number;
    createdAt: Date;
}
