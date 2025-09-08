"use client";

import type { Order } from "@/api/orders";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ColumnDef } from "@tanstack/react-table";

interface GetColumnsOptions {
  userRole: "admin" | "user";
  onStatusChange: (orderId: string, status: string) => void;
}

const getStatusVariant = (
  status: Order["status"]
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "paid":
      return "default";
    case "shipped":
      return "outline";
    case "cancelled":
      return "destructive";
    case "placed":
    default:
      return "secondary";
  }
};

export const getColumns = ({
  userRole,
  onStatusChange,
}: GetColumnsOptions): ColumnDef<Order>[] => {
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "ID do Pedido",
      cell: ({ row }) => (
        <div className="font-mono text-xs">{row.getValue("id")}</div>
      ),
    },

    ...(userRole === "admin"
      ? [
          {
            accessorKey: "user.name",
            header: "Cliente",
            cell: ({ row }) => row.original.user?.name || "N/A",
          } as ColumnDef<Order>,
        ]
      : []),
    {
      accessorKey: "createdAt",
      header: "Data",
      cell: ({ row }) =>
        new Date(row.getValue("createdAt")).toLocaleDateString("pt-BR"),
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => {
        const total = row.original.items.reduce(
          (acc, item) => acc + Number(item.price) * item.quantity,
          0
        );
        return new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(total);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const order = row.original;

        if (userRole === "admin") {
          return (
            <Select
              defaultValue={order.status}
              onValueChange={(value) => onStatusChange(order.id, value)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Mudar status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          );
        }

        return (
          <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
        );
      },
    },
  ];

  return columns;
};
