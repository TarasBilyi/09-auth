import { fetchNotes } from "@/lib/api/serverApi";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const filterTag = slug[0] === "all" ? "All Notes" : slug[0];

  const title = `Notes - ${filterTag}`;
  const description = `Browse notes filtered by ${filterTag.toLowerCase()}. Manage your notes efficiently with NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://09-auth-pi-red.vercel.app/notes/filter/${slug.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `Notes - ${filterTag}`,
        },
      ],
    },
  };
}

const NotesPage = async ({ params }: Props) => {
  const { slug } = await params;
  const filterTag = slug[0] === "all" ? undefined : slug[0];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", filterTag, 1],
    queryFn: () => fetchNotes("", 1, filterTag),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient filterTag={filterTag} />
    </HydrationBoundary>
  );
};

export default NotesPage;
