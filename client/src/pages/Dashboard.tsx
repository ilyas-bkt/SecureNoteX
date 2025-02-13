import { Navigate, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useEffect } from "react";
import { IsSessionValid } from "../tools/IsSessionValid";

//const API_SERVER_URL = String(import.meta.env["VITE_API_SERVER"]);

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    IsSessionValid().then((isValid) => {
      if (!isValid) {
        sessionStorage.setItem("status", "Session expired!");
        navigate("/login");
      }
    });
  }, [navigate]);

  if (!localStorage.getItem("data")) {
    return <Navigate to="/login" />;
  }

  const userData: {
    firstname: string;
    lastname: string;
    username: string;
    sessionId: string;
  } = JSON.parse(localStorage.getItem("data") as string);

  return (
    <main>
      <Header
        isLogin={true}
        firstName={userData.firstname}
        lastName={userData.lastname}
      />
    </main>
  );
}
