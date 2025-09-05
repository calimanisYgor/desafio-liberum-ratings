import { Request, Response } from "express";
import * as ProductService from "./products.service";
import {
  createProductSchema,
  listProductsSchema,
  productIdSchema,
  updateProductSchema,
} from "./products.schema";

export const createProductController = async (req: Request, res: Response) => {
  const { body } = createProductSchema.parse(req);
  const product = await ProductService.createProduct(body);
  res.status(201).json(product);
};

export const listProductsController = async (req: Request, res: Response) => {
  const { query } = listProductsSchema.parse(req);
  const result = await ProductService.listProducts(query);
  res.status(200).json(result);
};

export const getProductByIdController = async (req: Request, res: Response) => {
  const { params } = productIdSchema.parse(req);
  const product = await ProductService.getProductById(params.id);
  res.status(200).json(product);
};

export const updateProductController = async (req: Request, res: Response) => {
  const { params, body } = updateProductSchema.parse(req);
  const product = await ProductService.updateProduct(params.id, body);
  res.status(200).json(product);
};

export const deleteProductController = async (req: Request, res: Response) => {
  const { params } = productIdSchema.parse(req);
  await ProductService.deleteProduct(params.id);
  res.status(204).send();
};
