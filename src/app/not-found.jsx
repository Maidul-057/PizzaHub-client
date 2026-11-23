import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-7xl">🍕</p>
        <h1 className="text-4xl font-extrabold">404 - Page not found</h1>
        <p className="max-w-md text-muted-foreground">
          This slice is missing. The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </main>
      <Footer />
    </>
  );
}
