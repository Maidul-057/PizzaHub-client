import { LayoutDashboard, UtensilsCrossed, PlusCircle, ClipboardList, Crown, UserCog, ShoppingBag, Users, ReceiptText } from "lucide-react";

export const CURRENCY = "$";

export const CATEGORIES = [
  { name: "Classic Pizzas", emoji: "🍕", blurb: "Margherita, pepperoni and the all-time favourites" },
  { name: "Vegetarian Pizzas", emoji: "🥬", blurb: "Garden-fresh toppings, no meat needed" },
  { name: "Meat Lovers", emoji: "🍖", blurb: "Sausage, bacon, ham and plenty of cheese" },
  { name: "Specialty / Gourmet Pizzas", emoji: "✨", blurb: "Signature recipes from local chefs" },
  { name: "Sides & Appetizers", emoji: "🍟", blurb: "Garlic bread, wings and crispy starters" },
  { name: "Beverages & Desserts", emoji: "🥤", blurb: "Cold drinks and sweet endings" },
];
export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const dashboardPath = (role) =>
  role === "admin" ? "/dashboard/admin" : role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer";

// Extra navbar links shown after login, per role
export const NAV_ROLE_LINKS = {
  vendor: [
    { href: "/dashboard/vendor/items", label: "My Items" },
    { href: "/dashboard/vendor/orders", label: "Orders" },
  ],
  customer: [{ href: "/dashboard/customer/orders", label: "My Orders" }],
  admin: [
    { href: "/dashboard/admin/users", label: "Users" },
    { href: "/dashboard/admin/items", label: "Menu Items" },
  ],
};

export const SIDEBAR_LINKS = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/vendor/items", label: "My Menu Items", icon: UtensilsCrossed },
    { href: "/dashboard/vendor/items/new", label: "Add Menu Item", icon: PlusCircle },
    { href: "/dashboard/vendor/orders", label: "Customer Orders", icon: ClipboardList },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: Crown },
    { href: "/dashboard/profile", label: "Profile Settings", icon: UserCog },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/orders", label: "My Orders", icon: ShoppingBag },
    { href: "/dashboard/profile", label: "Profile Settings", icon: UserCog },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/items", label: "Manage Menu Items", icon: UtensilsCrossed },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: ReceiptText },
    { href: "/dashboard/profile", label: "Profile Settings", icon: UserCog },
  ],
};
