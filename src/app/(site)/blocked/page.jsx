import BlockedActions from "./BlockedActions";

export const metadata = { title: "Account blocked" };

export default function BlockedPage() {
  return (
    <div className="flex min-h-[65vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-6xl">🚫</p>
      <h1 className="text-3xl font-extrabold">Your account is blocked</h1>
      <p className="max-w-md text-muted-foreground">
        An administrator has blocked this account, so protected features are unavailable. Please contact support if you think this is a mistake.
      </p>
      <BlockedActions />
    </div>
  );
}
