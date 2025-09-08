import { Button } from "@/components/ui/button";
import {
  Sheet,  SheetContent,  SheetDescription,  SheetHeader,  SheetTitle,  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { createOrder } from "@/api/orders";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";

export function CartSidebar() {
  const {
    items,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Orders"] });
      clearCart();
      toast.success("Pedido criado com sucesso!");
    },
    onError: (error) => {
      toast.error(`Erro ao criar pedido: ${error.message}`);
    },
  });

  const handleCreateOrder = () => {
    if (!isAuthenticated || !user) {
      toast.error("Você precisa estar logado para criar um pedido.");
      return;
    }

    const payload = {
      items: items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    mutate(payload);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <ShoppingCart className="mr-2 h-4 w-4" /> 
          Carrinho ({getTotalItems()})
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Carrinho de compras</SheetTitle>
          <SheetDescription>
            Revise os itens no seu carrinho antes de finalizar a compra.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          {items.length === 0 ? (
            <p>Seu carrinho está vazio.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x R$ {item.price}
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => removeFromCart(item.id)}>
                  Remover
                </Button>
              </div>
            ))
          )}
        </div>
        {items.length > 0 && (
            <div className="text-right font-medium">
                Total: R$ {getTotalPrice().toFixed(2)}
            </div>
        )}
        <SheetFooter>
            <SheetClose asChild>
                <Button variant="outline" onClick={() => clearCart()}>Cancelar</Button>
            </SheetClose>
          <Button onClick={handleCreateOrder} disabled={isPending || items.length === 0}>
            {isPending ? "Finalizando..." : "Finalizar Compra"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
