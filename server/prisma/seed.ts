import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  { name: "Laptop", category: "Electronics", price: 800 },
  { name: "Headphones", category: "Electronics", price: 120 },
  { name: "Smartphone", category: "Electronics", price: 950 },
  { name: "Bluetooth Speaker", category: "Electronics", price: 180 },
  { name: "Smartwatch", category: "Electronics", price: 250 },

  { name: "T-shirt", category: "Clothing", price: 25 },
  { name: "Shoes", category: "Clothing", price: 60 },
  { name: "Jeans", category: "Clothing", price: 45 },
  { name: "Jacket", category: "Clothing", price: 90 },
  { name: "Cap", category: "Clothing", price: 15 },

  { name: "Coffee Maker", category: "Home", price: 150 },
  { name: "Blender", category: "Home", price: 100 },
  { name: "Vacuum Cleaner", category: "Home", price: 220 },
  { name: "Microwave", category: "Home", price: 300 },
  { name: "Table Lamp", category: "Home", price: 40 },

  { name: "Novel", category: "Books", price: 20 },
  { name: "Cookbook", category: "Books", price: 35 },
  { name: "Science Fiction", category: "Books", price: 25 },
  { name: "Biography", category: "Books", price: 30 },
  { name: "Children's Book", category: "Books", price: 15 },

  { name: "Football", category: "Sports", price: 50 },
  { name: "Tennis Racket", category: "Sports", price: 120 },
  { name: "Basketball", category: "Sports", price: 40 },
  { name: "Yoga Mat", category: "Sports", price: 25 },
  { name: "Running Shoes", category: "Sports", price: 95 },

  { name: "Lipstick", category: "Beauty", price: 20 },
  { name: "Perfume", category: "Beauty", price: 75 },
  { name: "Shampoo", category: "Beauty", price: 15 },
  { name: "Face Cream", category: "Beauty", price: 30 },
  { name: "Nail Polish", category: "Beauty", price: 10 },
];

async function main() {
  await prisma.product.createMany({
    data: products,
    skipDuplicates: true,
  });
  console.log("✅ Products seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
