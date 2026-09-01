'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getTasks() {
  const session = await getSession();
  if (!session) return [];

  return await prisma.task.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
  });
}

export async function addTask(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const label = formData.get('label') as string;
  const description = formData.get('description') as string;
  if (!label) return;

  await prisma.task.create({
    data: {
      label,
      description: description || null,
      userId: session.id,
      priority: 'ปกติ',
      category: 'ทั่วไป',
    },
  });

  revalidatePath('/dashboard/tasks');
}

export async function toggleTask(id: string, completed: boolean) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await prisma.task.update({
    where: { id, userId: session.id },
    data: { completed },
  });

  revalidatePath('/dashboard/tasks');
}

export async function updateTask(id: string, formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const label = formData.get('label') as string;
  const description = formData.get('description') as string;
  if (!label) return;

  await prisma.task.update({
    where: { id, userId: session.id },
    data: {
      label,
      description: description || null,
    },
  });

  revalidatePath('/dashboard/tasks');
}

export async function deleteTask(id: string) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  await prisma.task.delete({
    where: { id, userId: session.id },
  });

  revalidatePath('/dashboard/tasks');
}
