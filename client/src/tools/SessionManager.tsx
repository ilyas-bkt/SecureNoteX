import { API_SERVER_URL } from "../main";

export const IsSessionValid = async () => {
  if (!localStorage.getItem("userData")) return false;

  let sessionId;
  try {
    sessionId = JSON.parse(localStorage.getItem("userData") as string)
      .sessionId as string;
  } catch {
    return false;
  }

  const response = await fetch(`${API_SERVER_URL}/api/user/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: sessionId,
    },
  });

  if (!response.ok) {
    localStorage.removeItem("userData");
    return false;
  }
  return true;
};

export const Disconnect = (status: string) => {
  localStorage.removeItem("userData");
  localStorage.removeItem("userNotes");
  sessionStorage.setItem("status", status);
};