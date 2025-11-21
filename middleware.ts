export { auth as middleware } from "@/lib/auth-edge";

export const config = {
  matcher: ["/add-profile", "/profile/:path*/edit"],
};


