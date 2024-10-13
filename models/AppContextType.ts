import { UserResource } from "@clerk/types";
import { Post } from "./Post";
import { UserProfile } from "./UserProfile";

export interface AppContextType {
    userProfile: UserProfile | null;
    posts: Post[];
    clerkUser: UserResource | null;
}
