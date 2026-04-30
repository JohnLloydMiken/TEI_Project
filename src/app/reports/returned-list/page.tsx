"use client"
import ReturnedListWidgets from "@/components/dashboard/report-list/widgets"
import ReturnedCustomersTable from "@/components/dashboard/report-list/returned-table"
export default function ReturnedList(){
    return(
        <div className="w-full flex flex-col gap-3">
              <div>
                <h1 className="text-2xl text-teiblue font-bold">Returned List</h1>
                <p className="text-sm text-gray-400 font-light">
                 View List of Returnee Customers
                </p>
              </div>
        
            <ReturnedListWidgets batch={"April 2026"} returned={5}/>
             <ReturnedCustomersTable/>
            </div>
    )
}