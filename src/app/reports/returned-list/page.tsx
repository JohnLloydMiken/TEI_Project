"use client"

import { div } from 'motion/react-client';
import {useState} from 'react'
import * as XLSX from 'xlsx'

interface Customer {
   status: "Pending" | "BD Retained";
   account_code: string,
   account_no: string,
   account_name: string
}

export default function ExcelUpload(){
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setErorr] = useState('')

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) =>{
    const file = e.target.files?.[0]
    if(!file) return

    setLoading(true)
    setErorr('')

    try{
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data)
       const sheetName1 = workbook.SheetNames[0];
        const sheetName2 = workbook.SheetNames[1];
      const sheet1 = workbook.Sheets[sheetName1];
      const sheet2 = workbook.Sheets[sheetName2];

      

      if(!sheet1 || !sheet2){
        throw new Error('Excel must have sheets named "Returned" and "Balance"')
      }

      const returned: any[]= XLSX.utils.sheet_to_json(sheet1,{
        range: 1
      });
      const pending: any[]= XLSX.utils.sheet_to_json(sheet2);

      const normalizedPending: Customer[] = pending.map(row => ({
        account_code: String (row.account_code?? row["account_code"] ?? ''),
        account_no: String (row.account_no?? row["account_no"] ?? ''),
        account_name: String (row.account_name?? row["customer_name"] ?? ''),
        status: "Pending"
      }))

      const normalizedReturned: Customer[] = returned.map(row => ({
        account_code: String (row.account_code?? row["account_code"] ?? ''),
        account_no: String (row.account_no?? row["account_no"] ?? ''),
        account_name: String (row.account_name?? row["Account Name"] ?? ''),
        status: "BD Retained"
      }))
      
      console.log(normalizedPending.length)
      console.log(normalizedReturned.length)
      console.log(sheetName2)
      const combined = [...normalizedPending, ...normalizedReturned]

      setCustomers(combined)


    }catch(err: any){
      setErorr(err.message || "Failed to parse file")
      setCustomers([])
    }finally{
      setLoading(false)
    }
  }
  
  return(
    <div>
      <div>
        <label htmlFor="">Upload Ecel File</label>
        <input type="file" name="" id=""  accept='.xlsx, .xls' onChange={handleFile}/>
      </div>
      {loading && <p>Parsing.....</p>}
       {error && <p>Error.....</p>}
      <div>
          {customers.length > 0 && (
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Account Code</th>
                    <th>Account Number</th>
                    <th>Account Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  
                  {customers.map((c, index)=>(
                  
                  <tr key={index}>
                        <td>{c.account_code}</td>
                        <td>{c.account_no}</td>
                        <td>{c.account_name}</td>
                        <td>{c.status}</td>
                        
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  )
}

// import ReturnedListWidgets from "@/components/dashboard/report-list/widgets"
// import ReturnedCustomersTable from "@/components/dashboard/report-list/returned-table"
// export default function ReturnedList(){
//     return(
//         <div className="w-full flex flex-col gap-3">
//               <div>
//                 <h1 className="text-2xl text-teiblue font-bold">Returned List</h1>
//                 <p className="text-sm text-gray-400 font-light">
//                  View List of Returnee Customers
//                 </p>
//               </div>
        
//             <ReturnedListWidgets batch={"April 2026"} returned={5}/>
//              <ReturnedCustomersTable/>
//             </div>
//     )
// }