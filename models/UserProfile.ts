export interface UserProfile {
    id: string; // Clerk-generated ID
    username: string;
    slug: string;
    email: string;
    elfIds: string[];
    termsAccepted: boolean;
    communicationPreferences: {
        notificationEmails: boolean;
        newsletterEmails: boolean;
        partnerEmails: boolean;
    };
    preferredTheme: "light" | "dark";
    currentElfId: string;
    avatarUrl: string;
    favoritePostIds: string[];
    reportedPostIds: string[];
    createdAt: Date;
    readNewsAt?: Date;
}
