import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { Disconnect, IsSessionValid } from "../tools/SessionManager";

//const API_SERVER_URL = String(import.meta.env["VITE_API_SERVER"]);
const SESSION_TIMEOUT =
  Number(import.meta.env["VITE_SESSION_TIMEOUT_MINUTES"]) * 60 * 1000;

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextTimeout, setNextTimeout] = useState(new Date());
  const [disconnect, setDisconnect] = useState(false);

  useEffect(() => {
    IsSessionValid().then((isValid) => {
      if (!isValid) {
        sessionStorage.setItem("status", "Session expired!");
        navigate("/login");
      }
    });
  }, [navigate]);

  useEffect(() => {
    setNextTimeout(new Date(Date.now() + SESSION_TIMEOUT));
  }, []);

  useEffect(() => {
    if (disconnect) {
      Disconnect("Timeout reached!");
      navigate("/login");
    }
  }, [disconnect, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date(Date.now()));
      if (currentTime > nextTimeout) setDisconnect(true);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTime, nextTimeout, navigate]);

  const userData: {
    firstname: string;
    lastname: string;
    username: string;
    sessionId: string;
  } = JSON.parse(localStorage.getItem("data") as string);

  return (
    <main
      id="body-container"
      onMouseMove={() => {
        setNextTimeout(new Date(Date.now() + SESSION_TIMEOUT));
      }}
    >
      <Header
        isLogin={true}
        firstName={userData.firstname}
        lastName={userData.lastname}
      />
    </main>
  );
}
