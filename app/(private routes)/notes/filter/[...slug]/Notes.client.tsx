"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import css from "./NotesPage.module.css";
import { Toaster } from "react-hot-toast";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Loader from "@/components/Loader/Loader";
import Link from "next/link";
import { fetchNotes } from "@/lib/api/clientApi";

interface NotesClientProps {
  filterTag?: string;
}

export default function NotesClient({ filterTag }: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", searchQuery, currentPage, filterTag],
    queryFn: () => fetchNotes(searchQuery, currentPage, filterTag),
    placeholderData: (prev) => prev,
  });

  const totalPages = data?.totalPages ?? 1;

  const onChangeSearch = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChangeSearch={onChangeSearch} />

        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}

        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {data?.notes && data.notes.length > 0 && <NoteList notes={data.notes} />}

      {isLoading && <Loader />}
      {isError && <p>Помилка завантаження нотаток</p>}
      <Toaster position="top-center" />
    </div>
  );
}
