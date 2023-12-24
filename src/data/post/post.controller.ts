import PostConfig from "./post.config";
import PostService from "./post.service";
type HttpHeaderType = "accept" | "Authorization" | "Notion-Version" | "content-type";

class PostController {
  private static instance: PostController;

  private headers: { [key in HttpHeaderType]: string } = {
    accept: "application/json",
    Authorization: `Bearer ${PostConfig.NOTION_AUTH_TOKEN}`,
    "Notion-Version": "2022-06-28",
    "content-type": "application/json",
  };

  private postService = new PostService();

  constructor() {
    this.headers = {
      accept: "application/json",
      Authorization: `Bearer ${PostConfig.NOTION_AUTH_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "content-type": "application/json",
    };
    this.postService = new PostService();
  }

  public static getInstance() {
    if (!PostController.instance) {
      PostController.instance = new PostController();
    }
    return PostController.instance;
  }

  public getPostList = async () => {
    const res = await this.postService.getPostList();

    return res;
  };

  /**
   *
   * @param pageId
   * @returns Return notion to md parsed string
   */
  public getPostPage = async (pageId: string) => {
    const res = await this.postService.parseNotion2HTML(pageId);

    return res;
  };

  public getPostPageProperty = async (pageId: string, propertyId: string) => {
    const options = {
      method: "GET",
      headers: this.headers,
    };

    const res = await fetch(`${PostConfig.NOTION_API_BASE_URL}/pages/${pageId}/properties/${propertyId}`, options)
      .then((response) => response.json())
      .then((response) => response)
      .catch((err) => console.error(err));
    return res;
  };

  public getPostContent = async (pageId: string) => {
    const options = {
      method: "GET",
      headers: this.headers,
    };

    const res = await fetch(`${PostConfig.NOTION_API_BASE_URL}/blocks/${pageId}/children?page_size=100`, options)
      .then((response) => response.json())
      .then((response) => response)
      .catch((err) => console.error(err));
    return res;
  };
}

export default PostController;
