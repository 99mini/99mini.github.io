import { createFileRoute } from "@tanstack/react-router";
import { PostCard } from "@/components/PostCard";
import type { Post } from "@/types";

export const Route = createFileRoute("/post/")({
  loader: async () => {
    const { getAllPosts } = await import("@/lib/posts");
    return { posts: getAllPosts() };
  },
  component: PostListPage,
});

function PostListPage() {
  const { posts } = Route.useLoaderData() as { posts: Post[] };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-[var(--color-text)]">Blog</h1>
        <p className="text-[var(--color-muted)]">총 {posts.length}개의 포스트</p>
      </div>

      {posts.length === 0 ? (
        <p className="text-[var(--color-muted)]">아직 작성된 포스트가 없습니다.</p>
      ) : (
        <div className="grid gap-4">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
