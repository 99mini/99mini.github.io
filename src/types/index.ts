import { z } from "zod";

export const PostFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  summary: z.string(),
  tags: z.array(z.string()).default([]),
  thumbnail: z.string().optional(),
  draft: z.boolean().default(false),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

export type Post = PostFrontmatter & {
  slug: string;
  html: string;
};

export const GithubReleaseSchema = z.object({
  id: z.number(),
  tag_name: z.string(),
  name: z.string().nullable(),
  body: z.string().nullable(),
  html_url: z.string(),
  published_at: z.string().nullable(),
  draft: z.boolean(),
  prerelease: z.boolean(),
});

export type GithubRelease = z.infer<typeof GithubReleaseSchema>;
