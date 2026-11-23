import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return Response.json({ message: "Authentication required" }, { status: 401 });
    }
    if (!["vendor", "admin"].includes(session.user.role)) {
      return Response.json({ message: "Forbidden" }, { status: 403 });
    }
    const form = await req.formData();
    const file = form.get("file");
    if (!file || typeof file === "string") {
      return Response.json({ message: "No file uploaded" }, { status: 400 });
    }
    if (!file.type?.startsWith("image/")) {
      return Response.json({ message: "Only image files are allowed" }, { status: 400 });
    }
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ message: "Image must be smaller than 5 MB" }, { status: 400 });
    }
    if (!process.env.IMGBB_API_KEY) {
      return Response.json({ message: "Image upload is not configured" }, { status: 500 });
    }

    const body = new FormData();
    body.append("image", file);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`, {
      method: "POST",
      body,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json?.data?.url) {
      return Response.json({ message: "Image upload failed. Please try again." }, { status: 502 });
    }
    return Response.json({ url: json.data.url });
  } catch {
    return Response.json({ message: "Image upload failed" }, { status: 500 });
  }
}
