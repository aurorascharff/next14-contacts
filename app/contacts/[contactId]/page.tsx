import Image from 'next/image';
import LinkButton from '@/components/ui/LinkButton';
import { getContact } from '@/lib/services/getContact';
import DeleteContactButton from './_components/DeleteContactButton';
import Favorite from './_components/Favorite';
import type { Metadata } from 'next';

type PageProps = {
  params: {
    contactId: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const contact = await getContact(params.contactId);

  return contact && contact.first && contact.last
    ? {
        description: `Contact details for ${contact.first} ${contact.last}`,
        title: `${contact.first} ${contact.last}`,
      }
    : {
        description: 'Contact details for an unnamed contact',
        title: 'Unnamed Contact',
      };
}

export default async function ContactPage({ params }: PageProps) {
  const contact = await getContact(params.contactId);

  return (
    <div className="flex flex-col gap-4 lg:flex-row">
      <div>
        {contact.avatar && (
          <Image
            width={192}
            height={192}
            className="mr-8 rounded-3xl bg-gray object-cover"
            alt={`${contact.first} ${contact.last} avatar`}
            key={contact.avatar}
            src={contact.avatar}
          />
        )}
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="flex-start flex gap-4 text-3xl font-bold">
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{' '}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p className="text-2xl text-primary">
            <a className="text-primary no-underline hover:underline" href={`https://twitter.com/${contact.twitter}`}>
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div className="my-4 flex gap-2">
          <LinkButton theme="secondary" href={`/contacts/${params.contactId}/edit`}>
            Edit
          </LinkButton>
          <DeleteContactButton contactId={params.contactId} />
        </div>
      </div>
    </div>
  );
}
