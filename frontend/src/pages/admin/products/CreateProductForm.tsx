import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { productSchema } from "./productSchema";
import type { ProductFormData } from "./productSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProduct, getProductById, updateProduct } from "@/api/products";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

export default function CreateProductFormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  const { data: productToEdit, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id!),
    enabled: isEditMode,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (productToEdit) {
      reset({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        stock: productToEdit.stock,
      });
    }
  }, [productToEdit, reset]);

  const { mutate: createProductMutation, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Produto criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido.";
      toast.error(`Falha ao criar o produto: ${errorMessage}`);
    },
  });

  const { mutate: updateProductMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Produto atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", id] });
      navigate("/");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Ocorreu um erro desconhecido.";
      toast.error(`Falha ao criar o produto: ${errorMessage}`);
    },
  });

  const onSubmit = (data: ProductFormData) => {
    //@ts-ignore
    createProductMutation(data);

    if (isEditMode && id) {
      // @ts-ignore
      updateProductMutation({ id, productData: data });
    } else {
      // @ts-ignore
      createProductMutation(data);
    }
  };

  const isLoading = isPending || isUpdating

  if(isLoadingProduct){
    return <div>Carregando dados do produto</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? 'Editar Produto' : 'Adicionar Novo Produto'}</CardTitle>
        <CardDescription>
          {isEditMode ? 'Altere os detalhes do produto abaixo.' : 'Preencha os detalhes do produto abaixo.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="name">Nome do produto</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="price">Preço do produto</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              {...register("price")}
            />
            {errors.price && (
              <p className="text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="stock">Estoque do produto</Label>
            <Input id="stock" type="number" {...register("stock")} />
            {errors.stock && (
              <p className="text-sm text-red-600">{errors.stock.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="description">Descrição do produto</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              disabled={isPending}
              onClick={() => navigate("/")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Cadastrando..." : "Cadastrar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
