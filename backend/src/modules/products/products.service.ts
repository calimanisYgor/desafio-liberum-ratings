import { ILike } from "typeorm";
import { AppDataSource } from "../../database/data-source";
import { Product } from "../../entities/Product";
import { AppError } from "../../shared/AppError";

type ProductData = Omit<Product, "id" | "createdAt" | "updatedAt">;
type UpdateProductData = Partial<ProductData>;
type ListProductQuery = {
  page: string;
  limit: string;
  name?: string;
  sortBy: string;
  order: "ASC" | "DESC";
};

const productRepository = AppDataSource.getRepository(Product);

export const createProduct = async (data: ProductData): Promise<Product> => {
  const productExists = await productRepository.findOneBy({ name: data.name });
  if (productExists) {
    throw new AppError("A product with this name already exists", 409);
  }

  const product = productRepository.create(data);
  await productRepository.save(product);
  return product;
};

export const listProducts = async (query: ListProductQuery) => {
  const page = parseInt(query.page);
  const limit = parseInt(query.limit);
  const skip = (page - 1) * limit;

  const where: any = {};
  if (query.name) {
    where.name = ILike(`%${query.name}%`);
  }

  const [products, total] = await productRepository.findAndCount({
    where,
    order: { [query.sortBy]: query.order },
    take: limit,
    skip,
  });

  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data: products,
  };
};

export const getProductById = async (id: string): Promise<Product> => {
  const product = await productRepository.findOneBy({ id });
  if (!product) {
    throw new AppError("Product not found", 404);
  }
  return product;
};

export const updateProduct = async (
  id: string,
  data: UpdateProductData
): Promise<Product> => {
  const product = await getProductById(id);

  // valida se caso o nome for alterado verifica se já está em uso ou não
  if (data.name && data.name !== product.name) {
    const productExists = await productRepository.findOneBy({
      name: data.name,
    });
    if (productExists) {
      throw new AppError("A product with this name already exists", 409);
    }
  }

  productRepository.merge(product, data);
  await productRepository.save(product);
  return product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  const product = await getProductById(id);
  await productRepository.remove(product);
};
