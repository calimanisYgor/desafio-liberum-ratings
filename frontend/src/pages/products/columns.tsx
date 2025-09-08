"use client";

import { useAuthStore } from "@/stores/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProduct } from "@/api/products";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import type { Product } from "@/api/products";
import type { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import toast from "react-hot-toast";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(price);

      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleDateString("pt-BR")}</div>;
    },
  },
  {
    id: "add-to-cart",
    cell: ({ row }) => {
      const product = row.original;
      const addToCart = useCartStore((state) => state.addToCart);

      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            addToCart(product);
            toast.success(`${product.name} adicionado ao carrinho!`);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar ao carrinho
        </Button>
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    maxSize: 20,
    cell: ({ row }) => {
      const product = row.original;
      const user = useAuthStore.getState().user;
      const queryClient = useQueryClient();

      const { mutate: deleteProductMutation, isPending } = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
          toast.success("Produto apagado com sucesso!");
          queryClient.invalidateQueries({ queryKey: ["products"] });
        },
        onError: (error) => {
          toast.error(`Erro ao apagar produto: ${error.message}`);
        },
      });

      if (user?.role !== "admin") {
        return null;
      }

      return (
        <div className="text-left">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <Link to={`/admin/products/edit/${product.id}`}>
                <DropdownMenuItem>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-500 focus:text-red-500"
                onClick={() => deleteProductMutation(product.id)}
                disabled={isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Apagar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
