import { Post } from "./Post";
import { UserProfile } from "./UserProfile";

export interface AppUserContextType {
    isLoadingUserProfile: boolean;
    isConnected: boolean;
    userProfile: UserProfile | null;
    posts: Post[];
    clerckUserId: string | null;
}
