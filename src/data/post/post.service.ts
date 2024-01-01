import { NotionToMarkdown } from "notion-to-md";
import { Client } from "@notionhq/client";
import PostConfig from "./post.config";

type HttpHeaderType = "accept" | "Authorization" | "Notion-Version" | "content-type";

class PostService {
  private static instance: PostService;

  private notion: Client = new Client({
    auth: PostConfig.NOTION_AUTH_TOKEN,
  });

  private n2m: NotionToMarkdown = new NotionToMarkdown({ notionClient: this.notion });
  private headers: { [key in HttpHeaderType]: string } = {
    accept: "application/json",
    Authorization: `Bearer ${PostConfig.NOTION_AUTH_TOKEN}`,
    "Notion-Version": "2022-06-28",
    "content-type": "application/json",
  };

  private users: UserEntity = {};
  constructor() {
    this.notion = new Client({
      auth: PostConfig.NOTION_AUTH_TOKEN,
    });
    this.n2m = new NotionToMarkdown({ notionClient: this.notion });
    this.headers = {
      accept: "application/json",
      Authorization: `Bearer ${PostConfig.NOTION_AUTH_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "content-type": "application/json",
    };

    const options = {
      method: "GET",
      headers: this.headers,
    };
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

  public getPostList = async () => {
    const options = {
      method: "POST",
      headers: this.headers,
    };

    const data: any[] = await fetch(`${PostConfig.NOTION_API_BASE_URL}/databases/${PostConfig.NOTION_DB_ID}/query`, options)
      .then((response) => response.json())
      .then((response) => response.results)
      .catch((err) => console.error(err));

    if (!data) {
      return [];
    }

    const allUsers = await this.getUsers();
    const res: PostEntity[] = data
      .filter((postItem) => postItem.properties.visibility?.status?.name === "public")
      .map((filteredItem) => {
        return {
          id: filteredItem.id,
          createdAt: filteredItem.created_time,
          updatedAt: filteredItem.last_edited_time,
          author: allUsers[filteredItem.created_by.id]?.name,
          authorAvatar: allUsers[filteredItem.created_by.id]?.avatarUrl,
          thumbnail: filteredItem.cover?.external?.url || filteredItem.cover?.file?.url || "",
          abstract: filteredItem.properties.abstract.rich_text[0]?.plain_text,
          title: filteredItem.properties.title.title[0]?.plain_text,
          tags: filteredItem.properties.tags.multi_select,
        };
      });
    return res;
  };

  public getUsers = async (): Promise<UserEntity> => {
    const options = {
      method: "GET",
      headers: this.headers,
    };

    const data: { object: string; id: string; name: string; avatar_url: string; type: string; person: any }[] = await fetch(
      `${PostConfig.NOTION_API_BASE_URL}/users`,
      options
    )
      .then((response) => response.json())
      .then((response) => response.results)
      .catch((err) => console.error(err));

    if (!data) {
      return {};
    }
    const allUsers: UserEntity = {};
    data.forEach((item) => (allUsers[item.id] = { name: item.name, avatarUrl: item.avatar_url }));
    this.users = { ...allUsers };
    return allUsers;
  };
}

export default PostService;
