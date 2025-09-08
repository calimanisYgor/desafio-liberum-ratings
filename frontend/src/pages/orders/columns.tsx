"use client";


import type { ColumnDef } from "@tanstack/react-table";
import type { Order } from "@/api/orders";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "ID do Pedido",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("status")}</div>
    ),
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
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => {
      const items = row.getValue("items") as Order["items"];
      return (
        <div>
          {items.map((item) => (
            <div key={item.id}>
              {item.product ? item.product.name : "Product not found"} -{" "}
              {item.quantity} x R${item.price}
            </div>
          ))}
        </div>
      );
    },
  },
  {
    id: "total",
    header: "Total",
    cell: ({ row }) => {
      const items = row.original.items;
      const total = items.reduce(
        (acc, item) => acc + item.quantity * parseFloat(item.price),
        0
      );
      return (
        <div className="font-medium">
          {total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </div>
      );
    },
  },
];
