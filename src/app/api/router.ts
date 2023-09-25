import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token");
  const data = {
    status: 200,
    data: {
      token: token,
    },
  };
  return NextResponse.json(data);
}
