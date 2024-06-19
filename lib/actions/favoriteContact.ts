'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '../../db';

export async function favoriteContact(contactId: string, isFavorite: boolean) {
  await prisma.contact.update({
    data: {
      favorite: !isFavorite,
    },
    where: {
      id: contactId,
    },
  });
  revalidatePath('/');
}
