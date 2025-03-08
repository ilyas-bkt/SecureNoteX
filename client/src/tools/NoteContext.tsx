import { createContext } from "react";

export const NoteContext = createContext(
  {} as {
    setNoteBody: React.Dispatch<React.SetStateAction<string>>;
    noteBody: string;
  }
);