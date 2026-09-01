"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function getPosts() {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: { id: true, name: true, imageUrl: true, role: true }
        },
        likes: {
          select: { userId: true }
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, imageUrl: true }
            }
          },
          orderBy: { createdAt: "asc" }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return { success: true, posts, currentUser: session };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { success: false, error: "Failed to fetch posts" };
  }
}

export async function createPost(formData: FormData) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return { success: false, error: "Unauthorized" };
    }

    const content = formData.get("content") as string;
    if (!content || content.trim() === "") {
      return { success: false, error: "Content is required" };
    }

    let imageUrl = null;
    const file = formData.get("file") as File;
    
    if (file && file.size > 0) {
      if (file.size > 5 * 1024 * 1024) {
        return { success: false, error: "File size must be less than 5MB" };
      }
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public", "uploads", "posts");
      
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const extension = file.name.split(".").pop();
      const filename = `post-${session.id}-${uniqueSuffix}.${extension}`;
      const filePath = join(uploadDir, filename);

      await writeFile(filePath, buffer);
      imageUrl = `/uploads/posts/${filename}`;
    }

    const post = await prisma.post.create({
      data: {
        content,
        imageUrl,
        authorId: session.id
      }
    });

    revalidatePath("/dashboard/community");
    return { success: true, post };
  } catch (error) {
    console.error("Error creating post:", error);
    return { success: false, error: "Failed to create post" };
  }
}

export async function createComment(postId: string, content: string) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!content || content.trim() === "") {
      return { success: false, error: "Content is required" };
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: session.id
      }
    });

    revalidatePath("/dashboard/community");
    return { success: true, comment };
  } catch (error) {
    console.error("Error creating comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}

export async function toggleLike(postId: string) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return { success: false, error: "Unauthorized" };
    }

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.id
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      revalidatePath("/dashboard/community");
      return { success: true, liked: false };
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId: session.id
        }
      });
      revalidatePath("/dashboard/community");
      return { success: true, liked: true };
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    return { success: false, error: "Failed to toggle like" };
  }
}

export async function deletePost(postId: string) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return { success: false, error: "Unauthorized" };
    }

    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    // Allow author or SUPER_ADMIN/ADMIN to delete
    const { hasPermission } = await import("@/lib/rbac");
    if (post.authorId !== session.id && !hasPermission(session.role, "manage_community")) {
      return { success: false, error: "Not authorized to delete this post" };
    }

    await prisma.post.delete({
      where: { id: postId }
    });

    revalidatePath("/dashboard/community");
    return { success: true };
  } catch (error) {
    console.error("Error deleting post:", error);
    return { success: false, error: "Failed to delete post" };
  }
}

export async function updatePost(postId: string, newContent: string) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      return { success: false, error: "Unauthorized" };
    }

    if (!newContent || newContent.trim() === "") {
      return { success: false, error: "Content is required" };
    }

    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return { success: false, error: "Post not found" };
    }

    // Allow author or SUPER_ADMIN/ADMIN to edit
    const { hasPermission } = await import("@/lib/rbac");
    if (post.authorId !== session.id && !hasPermission(session.role, "manage_community")) {
      return { success: false, error: "Not authorized to edit this post" };
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { content: newContent }
    });

    revalidatePath("/dashboard/community");
    return { success: true, post: updatedPost };
  } catch (error) {
    console.error("Error updating post:", error);
    return { success: false, error: "Failed to update post" };
  }
}
