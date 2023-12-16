const NOTION_AUTH_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_DB_ID;

export const getNotionPost = async () => {
  const options = {
    method: "POST",
    headers: { accept: "application/json", Authorization: `Bearer ${NOTION_AUTH_TOKEN}`, "Notion-Version": "2022-06-28", "content-type": "application/json" },
  };

  const res = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, options)
    .then((response) => response.json())
    .then((response) => response)
    .catch((err) => console.error(err));
  return res;
};
