import { createContext } from "react";

export const DashboardContext = createContext(
  {} as {
    sessionId: string;
    setNotification: React.Dispatch<
      React.SetStateAction<{
        message?: string;
        color?: string;
        show: boolean;
      }>
    >;
    setNoteList: React.Dispatch<
      React.SetStateAction<
        {
          title: string;
          createdAt: string;
          modifiedAt: string;
          description: string;
          noteId: string;
        }[]
      >
    >;
  }
);
