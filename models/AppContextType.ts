import { UserResource } from "@clerk/types";
import { Post } from "./Post";
import { UserProfile } from "./UserProfile";

export interface AppContextType {
    clerkUser: UserResource | null;
    userProfile: UserProfile | null;
    posts: Post[];
    loadUserProfile?: () => Promise<void>;
}
