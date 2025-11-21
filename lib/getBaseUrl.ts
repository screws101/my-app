import { headers } from "next/headers";

export async function getBaseUrl(): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  
  if (host) {
    return `${protocol}://${host}`;
  }
  
  return process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
}


