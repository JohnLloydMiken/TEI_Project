import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { json } from "stream/consumers";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest,
    
) {
  
    try{
        const new_users = await prisma.user.create
    }catch{

    }
}
