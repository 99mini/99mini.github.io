import { createFileRoute } from "@tanstack/react-router";
import { PostCard } from "@/components/post-card";
import { getAllPosts } from "@/lib/posts";
import { SEO } from "@/scripts/seo";

export const Route = createFileRoute("/post/")({
  loader: () => ({ posts: getAllPosts() }),
  component: PostListPage,
});

function PostListPage() {
  const { posts } = Route.useLoaderData();

  return (
    <div className="flex flex-col gap-8">
      <SEO title="Blog" description="99mini의 개발 블로그 — 기술 글 모음" path="/post" />
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
