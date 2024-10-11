import { UserResource } from "@clerk/types";
import { Post } from "./Post";
import { UserProfile } from "./UserProfile";

export interface AppUserContextType {
    isLoadingUserProfile: boolean;
    isConnected: boolean;
    userProfile: UserProfile | null;
    posts: Post[];
    clerkUser: UserResource | null;
}
