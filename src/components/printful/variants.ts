// Real Printful variant IDs for photo books
export const PHOTO_BOOK_VARIANTS = [
  {
    id: 438,
    name: "Standard Photo Book",
    price: "$29.99",
    description: "8.5\" x 8.5\", 20 pages"
  },
  {
    id: 439,
    name: "Premium Photo Book",
    price: "$39.99",
    description: "10\" x 10\", 30 pages"
  },
  {
    id: 440,
    name: "Deluxe Photo Book",
    price: "$49.99",
    description: "12\" x 12\", 40 pages"
  }
] as const;

export const QUILT_VARIANTS = [
  {
    id: 441,
    name: "Standard Memory Quilt",
    price: "$79.99",
    description: "50\" x 60\", Cotton blend"
  }
] as const;