import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PaginationState } from "@tanstack/react-table";

import { useAuthStore } from "@/stores/authStore";
import { getOrders } from "@/api/orders";
import { DataTable } from "@/components/data-table";

import { columns } from "./columns";


export default function OrderListPage() {
  const user = useAuthStore((state) => state.user);

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
    queryKey: ["Orders", pagination],
    queryFn: () =>
      getOrders({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
      }),
  });

  const tableData = useMemo(() => data?.data ?? [], [data]);
  const pageCount = useMemo(() => data?.totalPages ?? 0, [data]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Pedidos</h1>
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
