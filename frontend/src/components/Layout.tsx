import { useAuthStore } from "@/stores/authStore";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ShoppingCart, LogOut } from "lucide-react";
import { CartSidebar } from "./cartSidebar";

export const Layout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  console.log(user?.name)

  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="sr-only">E-Commerce</span>
          </Link>
          <Link
            to="/"
            className="text-foreground transition-colors hover:text-foreground"
          >
            Produtos
          </Link>
          <Link
            to="/orders"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Pedidos
          </Link>
          {user?.role === 'admin' && (
             <Link
              to="/admin"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Admin
            </Link>
          )}
        </nav>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <div className="ml-auto flex-1 sm:flex-initial">
                <span>Bem-vindo, <strong>{user?.name}!</strong></span>
            </div>
            <CartSidebar />
            <Button onClick={handleLogout} variant="outline" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

