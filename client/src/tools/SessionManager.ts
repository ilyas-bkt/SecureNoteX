import { API_SERVER_URL } from "../main";

export const IsSessionValid = async () => {
  const response = await fetch(`${API_SERVER_URL}/api/user/session`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.ok;
};

export const UpdateLocalStorage = async () => {
  try {
    const noteData = await fetch(`${API_SERVER_URL}/api/note`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!noteData.ok) throw new Error("Unable to fetch notes");

    const userData = await fetch(`${API_SERVER_URL}/api/user`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!userData.ok) throw new Error("Unable to fetch user data");

    localStorage.setItem("note-data", JSON.stringify(await noteData.json()));
    localStorage.setItem("user-data", JSON.stringify(await userData.json()));
    return true;
  } catch {
    return false;
  }
};

export const LoadLocalStorage = () => {
  return {
    user: JSON.parse(localStorage.getItem("user-data") as string),
    note: JSON.parse(localStorage.getItem("note-data") as string),
  } as {
    user: { firstname: string; lastname: string; username: string };
    note: {
      title: string;
      createdAt: string;
      modifiedAt: string;
      description: string;
      noteId: string;
    }[];
  };
};

export const Disconnect = async ({
  message,
  error,
}: {
  message: string;
  error: boolean;
}) => {
  localStorage.clear();
  sessionStorage.setItem(
    "status",
    JSON.stringify({ message: message, error: error })
  );

  await fetch(`${API_SERVER_URL}/api/user/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
