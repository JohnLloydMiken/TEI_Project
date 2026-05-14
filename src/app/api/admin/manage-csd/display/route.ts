// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const users = await prisma.user.findMany({
//       where: { role: { not: "ADMIN" } },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         password: true,
//         createdAt: true,
//         _count: {
//           select: { claimed: true },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     // Flatten _count for cleaner response shape
    

//     return NextResponse.json(users, { status: 200 });
//   } catch (e) {
//     console.error("[GET /api/admin/manage-csd]", e);
//     return NextResponse.json({ error: "Failed to fetch users." }, { status: 500 });
//   }
// }