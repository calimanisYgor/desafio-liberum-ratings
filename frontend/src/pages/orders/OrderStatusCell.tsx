"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores/authStore";
import { updateOrderStatus } from "@/api/orders";
import type { Order } from "@/api/orders";
import toast from "react-hot-toast";

const ORDER_STATUSES: Order["status"][] = [
  "placed",
  "paid",
  "shipped",
  "cancelled",
];

export default function OrderStatusCell({ order }: { order: Order }) {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<Order["status"]>(
    order.status
  );

  const { mutate, isPending } = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      toast.success("Pedido atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["Orders"] });
    },
    onError: (error) => {
      toast.error("Erro ao atualizar pedido");

      console.error(error);
    },
  });

  const handleUpdate = () => {
    if (selectedStatus !== order.status) {
      mutate({ orderId: order.id, status: selectedStatus });
    }
  };

  if (user?.role !== "admin") {
    return <div className="w-[180px]" />;
  }

  return (
    <div className="flex w-[180px] items-center gap-2">
      <Select
        value={selectedStatus}
        onValueChange={(v) => setSelectedStatus(v as Order["status"])}
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUSES.map((status) => (
            <SelectItem key={status} value={status}>
              {status}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        size="sm"
        onClick={handleUpdate}
        disabled={isPending || selectedStatus === order.status}
      >
        {isPending ? "..." : "Save"}
      </Button>
    </div>
  );
}
