import { UserResource } from "@clerk/types";
import { Elf } from "./Elf";
import { Post } from "./Post";
import { UserProfile } from "./UserProfile";

export interface AppContextType {
    clerkUser: UserResource | null;
    userProfile: UserProfile | null;
    posts: Post[];
    elves: Elf[];
    currentElf: Elf | null;
    loadUserProfile?: () => Promise<void>;
}
