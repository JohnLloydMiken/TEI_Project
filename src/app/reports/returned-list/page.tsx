import { getAllCustomers } from "@/lib/data/customers-list";
import CustomersTable from "@/components/dashboard/report-list/returned-table";
import OverviewWidgets from "@/components/dashboard/eligibility-checker/widgets/overview-widgets";
import { Suspense } from "react";
import CustomerListSkeleton from "@/components/skeletons//Customer-list-skeleton";
interface Props {
  searchParams: { page?: string; status?: string };
}

export default async function CustomersList({ searchParams }: Props) {
  const { page: pageParam, status: statusParam } = await searchParams;
  const page = Number(pageParam ?? 1);
  const status = statusParam as "Pending" | "BD Retained" | undefined;

  return (
    <div className="w-full flex flex-col space-y-2">
      {/* Widgets don't block the table */}
      <Suspense fallback={<CustomerListSkeleton />}>
        <OverviewWidgets />
      </Suspense>

      {/* Table streams in on its own */}
      <Suspense fallback={<CustomerListSkeleton />} key={`${page}-${status}`}>
        <CustomerTableWrapper page={page} status={status} />
      </Suspense>
    </div>
  );
}

// Extract the data fetch into its own async server component
async function CustomerTableWrapper({ page, status }: { page: number; status?: "Pending" | "BD Retained" }) {
  const { customers, total, pageCount } = await getAllCustomers({ page, status });
  return (
    <CustomersTable
      customers={customers}
      total={total}
      pageCount={pageCount}
      currentPage={page}
      currentStatus={status}
    />
  );
}