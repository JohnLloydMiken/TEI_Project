import ColumnTable from "@/components/dashboard/admin/upload-list/column-table";
import AdminUploadPage from "@/components/dashboard/admin/upload-list/upload-list";
export default function Upload_List() {
  return (
    <div className="w-full flex flex-col gap-3">
      <div>
        <h1 className="text-2xl text-teiblue font-bold">Upload List</h1>
        <p className="text-sm text-gray-400 font-light">
          Upload Qualified Customer List. Make Sure to follow the Expected
          Column Format.
        </p>
      </div>

     
        <AdminUploadPage />
        
   
    </div>
  );
}
