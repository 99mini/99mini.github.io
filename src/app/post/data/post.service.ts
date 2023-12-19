import { NotionToMarkdown } from "notion-to-md";
import { Client } from "@notionhq/client";
import PostConfig from "./post.config";

const notion = new Client({
  auth: PostConfig.NOTION_AUTH_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

const parseNotion2HTML = async (targetPageId: string) => {
  const mdblocks = await n2m.pageToMarkdown(targetPageId);
  const mdString = n2m.toMarkdownString(mdblocks);
  return mdString.parent;
};

const PostService = {
  parseNotion2HTML,
};

export default PostService;
