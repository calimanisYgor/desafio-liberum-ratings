import { AppDataSource } from "./data-source";
import { User, UserRole } from "../entities/User";
import { Product } from "../entities/Product";
import * as bcrypt from "bcryptjs";

async function seed() {
  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");

  const userRepository = AppDataSource.getRepository(User);
  const productRepository = AppDataSource.getRepository(Product);

  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = userRepository.create({
    name: "Admin User",
    email: "admin@example.com",
    password: adminPassword,
    role: UserRole.ADMIN,
  });
  await userRepository.save(admin);
  console.log("Admin user created");

  const products = [
    {
      name: "Laptop Pro",
      description: "Powerful laptop",
      price: 1500.0,
      stock: 50,
    },
    {
      name: "Wireless Mouse",
      description: "Ergonomic mouse",
      price: 50.0,
      stock: 200,
    },
    {
      name: "Mechanical Keyboard",
      description: "RGB keyboard",
      price: 120.0,
      stock: 100,
    },
  ];

  for (const productData of products) {
    const product = productRepository.create(productData);
    await productRepository.save(product);
  }
  console.log("Products created");

  await AppDataSource.destroy();
  console.log("Data Source has been closed!");
}

seed().catch((error) => console.error("Seeding failed", error));
