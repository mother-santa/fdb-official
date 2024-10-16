"use client";

import { NoPostCard } from "@/components/NoPostCard";
import { PostCard } from "@/components/PostCard";
import { ProfileCreationCard } from "@/components/ProfileCreationCard";
import Container from "@/components/ui/container";
import { useAppContext } from "@/contexts";

export default function Home() {
    const { posts } = useAppContext();
    return (
        <Container className="max-w-lg flex flex-col gap-2">
            <ProfileCreationCard />
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
            {posts.length === 0 && <NoPostCard />}
        </Container>
    );
}
