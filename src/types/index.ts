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
  content: string;
};

export const GithubPRSchema = z.object({
  id: z.number(),
  number: z.number(),
  title: z.string(),
  html_url: z.string(),
  state: z.enum(["open", "closed"]),
  created_at: z.string(),
  closed_at: z.string().nullable(),
  merged_at: z.string().nullable(),
  body: z.string().nullable(),
  labels: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      color: z.string(),
    }),
  ),
  user: z.object({
    login: z.string(),
    avatar_url: z.string(),
    html_url: z.string(),
  }),
});

export type GithubPR = z.infer<typeof GithubPRSchema>;
