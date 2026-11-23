import SignInForm from "./SignInForm";

export const metadata = { title: "Sign In" };

export default async function SignInPage({ searchParams }) {
  const sp = await searchParams;
  // only allow same-site relative redirects
  const next = typeof sp?.next === "string" && sp.next.startsWith("/") && !sp.next.startsWith("//") ? sp.next : "/dashboard";
  return <SignInForm next={next} />;
}
