import {prisma} from "@/lib/prisma"
import { FetchCustomer } from "@/types/customer"
import { Decimal } from "@prisma/client/runtime/client";
import { error } from "console"
import { NextRequest, NextResponse } from "next/server"

export interface Customer{
    id: number;
    accountCode: string;
    accountNo: string;
    customerName: string;
    status: string;
    address: string | null;
    email: string | null;
    phone: string | null;
    depositAmount: Decimal | null;
    batchId: number;
}

interface Customers{
    customer: Customer[],
    BDRetained: Customer[],
    Pending: Customer[]
}

export async function getAllCustomers(): Promise <Customers>{

    const customer = await prisma.customer.findMany()

    const BDRetained = customer.filter((c)=> c.status === "BD Retained")
    const Pending = customer.filter((c)=> c.status === "Pending")
    return {customer, BDRetained, Pending}
}

export async function getCurrentBatch(){
    const current_batch = await prisma.customer.findMany({
        include: {batch: true}
    })

    return current_batch
}
