import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { PaginationState } from "@tanstack/react-table";

import { useAuthStore } from "@/stores/authStore";
import { getProducts } from "@/api/products";
import { useDebounce } from "@/hooks/useDebounce";
import { DataTable } from "@/components/data-table";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle } from "lucide-react";
import { columns } from "./columns";


export default function ProductListPage() {
  const user = useAuthStore((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", pagination, debouncedSearchTerm],
    queryFn: () =>
      getProducts({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        name: debouncedSearchTerm,
      }),
  });

  const tableData = useMemo(() => data?.data ?? [], [data]);
  const pageCount = useMemo(() => data?.totalPages ?? 0, [data]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Produtos</h1>
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Filtrar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        {user?.role === "admin" && (
          <Link to="/admin/products/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Produto
            </Button>
          </Link>
        )}
      </div>

      {isLoading && !data ? (
        <div className="flex items-center justify-center p-24">
          <p>Carregando dados dos produtos...</p>
        </div>
      ) : isError ? (
        <div className="flex items-center justify-center p-24">
          <p className="text-red-500">
            Erro ao carregar produtos:{" "}
            {error instanceof Error ? error.message : "Erro desconhecido"}
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={tableData}
          pageCount={pageCount}
          pagination={pagination}
          setPagination={setPagination}
        />
      )}
    </div>
  );
}
