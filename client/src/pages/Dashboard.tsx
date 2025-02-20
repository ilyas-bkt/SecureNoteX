import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { Disconnect, IsSessionValid } from "../tools/SessionManager";
import AddLogo from "../assets/plus.png";
import { NotePreview } from "../components/NotePreview";
import { SessionContext } from "../tools/SessionContext";

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
        Disconnect("Session expired!");
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
    <>
      <Header
        isLogin={true}
        firstName={userData.firstname}
        lastName={userData.lastname}
      />
      <main
        id="main-container"
        onMouseMove={() => {
          setNextTimeout(new Date(Date.now() + SESSION_TIMEOUT));
        }}
        className="grid grid-cols-1 gap-[30px] h-full w-full p-[30px]"
      >
        <SessionContext.Provider value={userData.sessionId}>
          <NotePreview
            createdAt="hier"
            title="Note de cours sjkfd klsdjfks jlk;dsjf;lksdj lksdjfkjsd kjdk jdksfjklj sdkf"
            description="Notes de cours sur mon cours de PPO"
            modifiedAt="maintenant"
            noteId={"1"}
          />
          <NotePreview
            createdAt="hier"
            title="Note de cours"
            description="Notes de cours sur mon cours de PPO"
            modifiedAt="maintenant"
            noteId={"i712jhweilufqyo9788q079q246lijhafds"}
          />
          <NotePreview
            createdAt="hier"
            title="Note de cours"
            description="Notes de cours sur mon cours de PPO"
            modifiedAt="maintenant"
            noteId={"1"}
          />
          <NotePreview
            createdAt="hier"
            title="Note de cours"
            description="Notes de cours sur mon cours de PPO"
            modifiedAt="maintenant"
            noteId={"1"}
          />
          <NotePreview
            createdAt="hier"
            title="Note de cours"
            description="Notes de cours sur mon cours de PPO"
            modifiedAt="maintenant"
            noteId={"1"}
          />
          <NotePreview
            createdAt="hier"
            title="Note de cours"
            description="Notes de cours sur mon cours de PPO"
            modifiedAt="maintenant"
            noteId={"1"}
          />
        </SessionContext.Provider>
        <button
          type="button"
          className="fixed bottom-[30px] right-[30px] w-[80px] bg-white border-[2px] rounded-[50%] shadow-xl hover:bg-gray-200 active:border-none"
        >
          <img src={AddLogo} alt="Add" />
        </button>
      </main>
    </>
  );
}
