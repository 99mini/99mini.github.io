const NOTION_AUTH_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;
const NOTION_API_BASE_URL = "https://api.notion.com/v1";

const PostConfig = { NOTION_AUTH_TOKEN, NOTION_DB_ID, NOTION_API_BASE_URL };

export default PostConfig;
