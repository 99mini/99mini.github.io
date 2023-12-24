import { NotionToMarkdown } from "notion-to-md";
import { Client } from "@notionhq/client";
import PostConfig from "./post.config";

class PostService {
  private static instance: PostService;

  private notion: Client = new Client({
    auth: PostConfig.NOTION_AUTH_TOKEN,
  });

  private n2m: NotionToMarkdown = new NotionToMarkdown({ notionClient: this.notion });

  constructor() {
    this.notion = new Client({
      auth: PostConfig.NOTION_AUTH_TOKEN,
    });
    this.n2m = new NotionToMarkdown({ notionClient: this.notion });
  }

  public static getInstance() {
    if (!PostService.instance) {
      PostService.instance = new PostService();
    }
    return PostService.instance;
  }

  public parseNotion2HTML = async (targetPageId: string) => {
    const mdblocks = await this.n2m.pageToMarkdown(targetPageId);
    const mdString = this.n2m.toMarkdownString(mdblocks);
    return mdString.parent;
  };
}

export default PostService;
