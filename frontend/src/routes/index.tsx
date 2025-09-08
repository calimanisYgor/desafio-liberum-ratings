import { Routes, Route } from "react-router-dom";

// Componentes

import { ProtectedRoute } from "./ProtectedRoute";
import LoginPage from "@/pages/login/LoginPage";
import OrderListPage from "@/pages/orders/OrderPage";
import ProductListPage from "@/pages/products/ProductPage";
import CreateProductFormPage from "@/pages/admin/products/CreateProductForm";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="*" element={<h1>404: Página Não Encontrada</h1>} />

    <Route element={<ProtectedRoute />}>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/orders" element={<OrderListPage />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/products/new" element={<CreateProductFormPage />} />
        <Route path="/admin/products/edit/:id" element={<CreateProductFormPage />} />
        <Route path="/admin/products/delete/:id" element={<ProductListPage />} />
      </Route> 
    </Routes>
  );
};
