import { PostCard } from "@/components/PostCard";
import { ProfileCreationCard } from "@/components/ProfileCreationCard";
import Container from "@/components/ui/container";
import { Post } from "@/models";

export default function Home() {
    const post: Post = {
        id: "post1",
        elfId: "elf123",
        elfeName: "Jingle Bells",
        imageUrl: "",
        description: "Just finished decorating the Christmas tree! 🎄✨ #ElfLife",
        createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000), // Approximately 6 months ago
        likeCount: 42,
        likedByUserIds: ["user1", "user2", "user3"],
        isPrivate: false
    };
    return (
        <Container className="max-w-lg pt-20">
            <ProfileCreationCard />
            {Array(50)
                .fill(0)
                .map((_, index) => (
                    <PostCard key={index} className="px-2 my-4" post={post} />
                ))}
        </Container>
    );
}
