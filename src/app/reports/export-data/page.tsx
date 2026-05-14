import ExportPage from "@/components/dashboard/export-data/export";
export default function ExportData() {
  return (
    <div className="w-full flex flex-col gap-3">
      <div>
        <h1 className="text-2xl text-teiblue font-bold">Export Data</h1>
        <p className="text-sm text-gray-400 font-light">
          Export an excel file report/s
        </p>
      </div>

      <ExportPage />
    </div>
  );
}
  