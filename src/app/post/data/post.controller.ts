import PostConfig from "./post.config";
import PostService from "./post.service";

const headers = {
  accept: "application/json",
  Authorization: `Bearer ${PostConfig.NOTION_AUTH_TOKEN}`,
  "Notion-Version": "2022-06-28",
  "content-type": "application/json",
};

export const getPostList = async () => {
  const options = {
    method: "POST",
    headers,
  };

  const data: any[] = await fetch(`${PostConfig.NOTION_API_BASE_URL}/databases/${PostConfig.NOTION_DB_ID}/query`, options)
    .then((response) => response.json())
    .then((response) => response.results)
    .catch((err) => console.error(err));

  if (!data) {
    return [];
  }

  const res = data.filter((postItem) => postItem.properties.visibility?.status?.name === "public");

  return res;
};

/**
 *
 * @param pageId
 * @returns Return notion to md parsed string
 */
export const getPostPage = async (pageId: string) => {
  const res = await PostService.parseNotion2HTML(pageId);

  return res;
};

export const getPostPageProperty = async (pageId: string, propertyId: string) => {
  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(`${PostConfig.NOTION_API_BASE_URL}/pages/${pageId}/properties/${propertyId}`, options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
  return res;
};

export const getPostContent = async (pageId: string) => {
  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(`${PostConfig.NOTION_API_BASE_URL}/blocks/${pageId}/children?page_size=100`, options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
  return res;
};

const PostController = { getPostList, getPostPage, getPostPageProperty, getPostContent };

export default PostController;
