export interface UserProfile {
    id: string; // Clerk-generated ID
    username: string;
    email: string;
    elfIds: string[];
    termsAccepted: boolean;
    communicationPreferences: {
        notificationEmails: boolean;
        newsletterEmails: boolean;
        partnerEmails: boolean;
    };
    preferredTheme: "light" | "dark";
    activeElfId: string;
    avatarUrl: string;
}
