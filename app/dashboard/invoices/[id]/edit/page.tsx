import Form from "@/app/ui/invoices/edit-form";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: Props, parentMetadata: ResolvingMetadata): Promise<Metadata> {
  const { id } = await params;
  const invoice = await fetchInvoiceById(id);
  const previousImage = ( await parentMetadata).openGraph?.images || [];

  if (!invoice) {
    return {
      title: 'Invoice Not Found',
    };
  }

  return {
    title: `Edit Invoice ${invoice.amount} - ${invoice.customer_id}`,
    openGraph: {
      images: [...previousImage]
    }
  };
}

export default async function Page({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const [ invoice, customers] = await Promise.all([
    fetchInvoiceById(id),
    fetchCustomers()
  ]);

  if(!invoice) {
    notFound()
  }
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: "Invoices", href: "/dashboard/invoices" },
          {
            label: "Edit Invoice",
            href: `/dashboard/invoices/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  );
}
