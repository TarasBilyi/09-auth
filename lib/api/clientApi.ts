import { NewNoteBody, Note } from "@/types/note";
import { nextServer } from "./api";
import { User } from "@/types/user";

export interface fetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface CheckSessionRequest {
  success: boolean;
}

export async function fetchNotes(
  searchQuery: string = "",
  page: number = 1,
  notesTag?: string,
) {
  const { data } = await nextServer.get<fetchNotesResponse>("/notes", {
    params: {
      page,
      perPage: 12,
      search: searchQuery || undefined,
      tag: notesTag || undefined,
    },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await nextServer.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(newNote: NewNoteBody): Promise<Note> {
  const { data } = await nextServer.post<Note>("/notes", newNote);
  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await nextServer.delete<Note>(`/notes/${id}`);
  return data;
}

export async function register(data: AuthRequest) {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
}

export async function login(data: AuthRequest) {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
}

export async function logout(): Promise<void> {
  await nextServer.post("/auth/logout");
}

export async function checkSession() {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
}

export async function getMe() {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
}

export async function updateMe(data: { username?: string }) {
  const { data: updatedUser } = await nextServer.patch<User>("/users/me", data);
  return updatedUser;
}
