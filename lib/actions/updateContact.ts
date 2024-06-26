'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { prisma } from '@/db';
import type { ContactSchemaErrorType, ContactSchemaType } from '@/validations/contactSchema';
import { contactSchema } from '@/validations/contactSchema';

type State = {
  success?: boolean;
  data?: ContactSchemaType;
  error?: ContactSchemaErrorType;
};

export async function updateContact(contactId: string, _prevState: State, formData: FormData): Promise<State> {
  const contact = Object.fromEntries(formData);
  const result = contactSchema.safeParse(contact);

  if (!result.success) {
    return {
      data: contact as ContactSchemaType,
      error: result.error.formErrors,
      success: false,
    };
  }

  await prisma.contact.update({
    data: result.data,
    where: {
      id: contactId,
    },
  });

  revalidatePath('/');
  redirect(`/contacts/${contactId}`);
}
