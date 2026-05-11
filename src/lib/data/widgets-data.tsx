import {prisma} from "@/lib/prisma"
import { FetchCustomer } from "@/types/customer"
import { error } from "console"
import { NextRequest, NextResponse } from "next/server"

export async function getAllCustomers(){

    const customer = await prisma.customer.findMany()
    return customer
}

export async function getCurrentBatch(){
    const current_batch = await prisma.customer.findMany({
        include: {batch: true}
    })

    return current_batch
}
