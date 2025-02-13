const API_SERVER_URL = String(import.meta.env["VITE_API_SERVER"]);

export const IsSessionValid = async () => {
  let sessionId;
  try {
    sessionId = JSON.parse(localStorage.getItem("data") as string)
      .sessionId as string;
  } catch {
    return false;
  }

  const response = await fetch(`${API_SERVER_URL}/api/session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: sessionId,
    },
  });

  if (!response.ok) {
    localStorage.removeItem("data");
    return false;
  }
  return true;
};