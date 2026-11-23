export default function EmptyState({ emoji = "🍕", title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-card px-6 py-14 text-center">
      <p className="mb-3 text-5xl">{emoji}</p>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
