import { CURRENCY } from "./constants";

export const formatPrice = (n) => `${CURRENCY}${Number(n || 0).toFixed(2)}`;

export const formatDate = (d, withTime = false) => {
  if (!d) return "-";
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return String(d);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
};

// "YYYY-MM-DD" strings should not shift with time zones
export const formatDay = (s) => {
  if (!s) return "-";
  const [y, m, d] = String(s).split("-").map(Number);
  if (!y || !m || !d) return String(s);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

export const todayISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

export const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "U";
