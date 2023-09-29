import { NextApiRequest, NextApiResponse } from "next";

export async function GET() {
  try {
    const res = { message: "hello" };

    const data = res;
    console.log(res);
    return Response.json({ data });
  } catch (error) {
    return Response.json({ error });
  }
}
