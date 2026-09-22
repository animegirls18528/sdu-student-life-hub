import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  return handleUpdateStudent(req, params);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  return handleUpdateStudent(req, params);
}

async function handleUpdateStudent(
  req: NextRequest,
  paramsInput: Promise<{ id: string }> | { id: string }
) {
  try {
    // 1. Check Authentication (Session / Token)
    const session = await getSession(req);
    if (!session || !session.id) {
      return NextResponse.json(
        { error: "Unauthorized: Please log in first" },
        { status: 401 }
      );
    }

    const resolvedParams = await paramsInput;
    const targetId = resolvedParams.id;

    // 2. Check if target student/user exists in database
    const targetUser = await prisma.user.findUnique({
      where: { id: targetId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    // 3. Authorization Check (IDOR Prevention)
    // Require session ID to match target ID, OR user must be an Admin/Super Admin
    const isAdmin = session.role === "ADMIN" || session.role === "SUPER_ADMIN";
    const isOwner = session.id === targetId;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: You do not have permission to modify another student's profile" },
        { status: 403 }
      );
    }

    // 4. Parse request body and update user data
    const body = await req.json();
    const updateData: Record<string, any> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.studentId !== undefined) updateData.studentId = body.studentId;
    if (isAdmin) {
      if (body.email !== undefined) updateData.email = body.email;
      if (body.role !== undefined) updateData.role = body.role;
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetId },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        studentId: true,
        imageUrl: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      { message: "Student profile updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Update Student Error:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Duplicate value: studentId or email already in use" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
