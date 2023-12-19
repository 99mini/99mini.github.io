const NOTION_AUTH_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;
const NOTION_API_BASE_URL = "https://api.notion.com/v1";

const headers = {
  accept: "application/json",
  Authorization: `Bearer ${NOTION_AUTH_TOKEN}`,
  "Notion-Version": "2022-06-28",
  "content-type": "application/json",
};

export const getPostList = async () => {
  const options = {
    method: "POST",
    headers,
  };

  const data: any[] = await fetch(`${NOTION_API_BASE_URL}/databases/${NOTION_DB_ID}/query`, options)
    .then((response) => response.json())
    .then((response) => response.results)
    .catch((err) => console.error(err));

  if (!data) {
    return [];
  }

  data.filter((postItem) => postItem.properties.visibility.status.name === "public");
  return data;
};

export const getPostPage = async (pageId: string) => {
  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(`${NOTION_API_BASE_URL}/pages/${pageId}`, options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
  return res;
};

export const getPostPageProperty = async (pageId: string, propertyId: string) => {
  const options = {
    method: "GET",
    headers,
  };

  const res = await fetch(`${NOTION_API_BASE_URL}/pages/${pageId}/properties/${propertyId}`, options)
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

  const res = await fetch(`${NOTION_API_BASE_URL}/blocks/${pageId}/children?page_size=100`, options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
  return res;
};
