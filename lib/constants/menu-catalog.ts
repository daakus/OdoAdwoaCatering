export type MenuCategorySlug =
  | "all"
  | "kenkey"
  | "protein"
  | "sides"
  | "drinks";

export interface MenuItem {
  id: string;
  title: string;
  description: string;
  priceGhs: number;
  category: Exclude<MenuCategorySlug, "all">;
  badge?: "Popular" | "Best Value" | "New";
  emoji: string;
}

export const MENU_CATEGORY_TABS: { value: MenuCategorySlug; label: string }[] =
  [
    { value: "all",     label: "All Items" },
    { value: "kenkey",  label: "Kenkey Packages" },
    { value: "protein", label: "Proteins & Grills" },
    { value: "sides",   label: "Sides & Condiments" },
    { value: "drinks",  label: "Local Bar Drinks" },
  ];

export const MENU_ITEMS: MenuItem[] = [
  // ── Kenkey Packages ───────────────────────────────────────────────
  {
    id: "kenkey-standard",
    title: "Millet Kenkey — Standard",
    description:
      "1 ball of fresh millet kenkey served with gravy & fried fish, shito, and hot peppers.",
    priceGhs: 50,
    category: "kenkey",
    badge: "Popular",
    emoji: "🌽",
  },
  {
    id: "kenkey-double",
    title: "Millet Kenkey — Double",
    description:
      "2 balls of fresh millet kenkey served with gravy & fried fish, okra stew, shito, and hot peppers.",
    priceGhs: 90,
    category: "kenkey",
    badge: "Best Value",
    emoji: "🌽",
  },
  {
    id: "kenkey-family",
    title: "Millet Kenkey — Family Pack",
    description:
      "4 balls of millet kenkey with full sides: gravy, fried fish, okra stew, shito, and peppers. Perfect for the family.",
    priceGhs: 170,
    category: "kenkey",
    emoji: "🌽",
  },

  // ── Proteins ──────────────────────────────────────────────────────
  {
    id: "protein-pork",
    title: "Grilled Pork",
    description:
      "Juicy, perfectly seasoned grilled pork. Pairs excellently with kenkey.",
    priceGhs: 30,
    category: "protein",
    badge: "Popular",
    emoji: "🥩",
  },
  {
    id: "protein-tilapia",
    title: "Grilled Tilapia",
    description:
      "Whole grilled tilapia marinated in local spices and grilled to perfection.",
    priceGhs: 35,
    category: "protein",
    emoji: "🐟",
  },
  {
    id: "protein-chicken",
    title: "Grilled Chicken",
    description:
      "Half or full chicken, grilled with our signature blend of Ghanaian herbs and spices.",
    priceGhs: 40,
    category: "protein",
    emoji: "🍗",
  },
  {
    id: "protein-fried-fish",
    title: "Fried Fish (Whole)",
    description:
      "Crispy whole fried fish, seasoned and deep-fried golden. A classic pairing with kenkey.",
    priceGhs: 25,
    category: "protein",
    emoji: "🐠",
  },

  // ── Sides ─────────────────────────────────────────────────────────
  {
    id: "side-okra-stew",
    title: "Okra Stew",
    description:
      "Rich, slow-cooked okra stew with tomatoes, onions, and assorted spices.",
    priceGhs: 10,
    category: "sides",
    emoji: "🥬",
  },
  {
    id: "side-shito",
    title: "Shito (Black Pepper Sauce)",
    description:
      "Our house-made shito — Ghana's beloved spicy black pepper condiment.",
    priceGhs: 5,
    category: "sides",
    emoji: "🌶️",
  },
  {
    id: "side-gravy",
    title: "Extra Gravy",
    description: "Extra rich and flavourful fish gravy served warm.",
    priceGhs: 5,
    category: "sides",
    emoji: "🥣",
  },
  {
    id: "side-hot-peppers",
    title: "Fresh Hot Peppers",
    description: "Freshly blended hot pepper mix for the heat lovers.",
    priceGhs: 3,
    category: "sides",
    emoji: "🌶️",
  },

  // ── Drinks ────────────────────────────────────────────────────────
  {
    id: "drink-sobolo",
    title: "Sobolo (500 ml)",
    description:
      "Chilled hibiscus drink, naturally sweetened with ginger and cloves. Refreshing and delicious.",
    priceGhs: 10,
    category: "drinks",
    badge: "Popular",
    emoji: "🥤",
  },
  {
    id: "drink-asana",
    title: "Asana (500 ml)",
    description:
      "Traditional Ghanaian fermented millet drink. Lightly sweet and earthy.",
    priceGhs: 10,
    category: "drinks",
    emoji: "🫙",
  },
  {
    id: "drink-pito",
    title: "Pito (500 ml)",
    description:
      "Northern Ghanaian traditional sorghum/millet beer. A cultural staple.",
    priceGhs: 8,
    category: "drinks",
    emoji: "🍺",
  },
  {
    id: "drink-lamugin",
    title: "Lamugin (500 ml)",
    description: "Sweet, spiced herbal drink packed with local roots and ginger.",
    priceGhs: 10,
    category: "drinks",
    emoji: "🌿",
  },
  {
    id: "drink-water",
    title: "Chilled Bottled Water",
    description: "Cold mineral water to accompany your meal.",
    priceGhs: 5,
    category: "drinks",
    emoji: "💧",
  },
];

// ── Event Catering ────────────────────────────────────────────────────────────
export type EventType = "Wedding" | "Funeral" | "Party" | "Corporate" | "Other";

export const EVENT_TYPES: EventType[] = [
  "Wedding",
  "Funeral",
  "Party",
  "Corporate",
  "Other",
];

export interface EventPackage {
  id: string;
  title: string;
  description: string;
  pricePerHeadGhs: number;
  minGuests: number;
}

export const EVENT_PACKAGES: EventPackage[] = [
  {
    id: "event-kenkey-buffet",
    title: "Millet Kenkey Buffet",
    description:
      "Full kenkey buffet station: multiple kenkey balls, full sides (okra stew, shito, peppers, gravy), and assorted fried fish.",
    pricePerHeadGhs: 45,
    minGuests: 50,
  },
  {
    id: "event-kenkey-protein-buffet",
    title: "Kenkey + Protein Buffet",
    description:
      "Kenkey buffet station combined with a full protein grill spread: pork, tilapia, and chicken.",
    pricePerHeadGhs: 80,
    minGuests: 50,
  },
  {
    id: "event-drinks-package",
    title: "Assorted Local Drinks Package",
    description:
      "Full bar station with Sobolo, Asana, Pito, Lamugin, and chilled bottled water for all guests.",
    pricePerHeadGhs: 20,
    minGuests: 30,
  },
  {
    id: "event-full-catering",
    title: "Full Catering Package (Food + Drinks)",
    description:
      "Comprehensive catering: full kenkey & protein buffet + complete local drinks bar. Best for weddings and large funerals.",
    pricePerHeadGhs: 95,
    minGuests: 100,
  },
];
