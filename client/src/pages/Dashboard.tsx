import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { Disconnect, IsSessionValid } from "../tools/SessionManager";
import AddLogo from "../assets/plus.png";
import { NotePreview } from "../components/NotePreview";
import { DashboardContext } from "../tools/DashboardContext";
import { API_SERVER_URL } from "../main";
import { Notification } from "../components/Notification";

//const API_SERVER_URL = String(import.meta.env["VITE_API_SERVER"]);
const SESSION_TIMEOUT =
  Number(import.meta.env["VITE_SESSION_TIMEOUT_MINUTES"]) * 60 * 1000;

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextTimeout, setNextTimeout] = useState(new Date());
  const [disconnect, setDisconnect] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [notesLoading, setNotesLoading] = useState(true);
  const [userData, setUserData] = useState(
    {} as {
      firstname: string;
      lastname: string;
      sessionId: string;
      username: string;
    }
  );
  const [notification, setNotification] = useState({ show: false } as {
    message?: string;
    color?: string;
    show: boolean;
  });
  const [noteList, setNoteList] = useState(
    [] as {
      title: string;
      createdAt: string;
      modifiedAt: string;
      description: string;
      noteId: string;
    }[]
  );

  useEffect(() => {
    IsSessionValid().then(async (isValid) => {
      if (!isValid) {
        Disconnect("Session expired!");
        navigate("/login");
      } else {
        setUserData(JSON.parse(localStorage.getItem("userData") as string));
        setPageLoading(false);
      }
    });
  }, [navigate]);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!pageLoading && userData.sessionId) {
        const response = await fetch(`${API_SERVER_URL}/api/note`, {
          headers: {
            Authorization: userData.sessionId,
          },
        });

        if (response.ok) {
          const userNotes = await response.json();
          setNoteList(userNotes);
          localStorage.setItem("userNotes", JSON.stringify(userNotes));
          setNotesLoading(false);
        }
      }
    };

    fetchNotes();
  }, [pageLoading, userData.sessionId]);

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

  return pageLoading ? (
    <>Loading...</>
  ) : (
    <>
      <Header
        isLogin={true}
        firstName={userData.firstname}
        lastName={userData.lastname}
      />
      <Notification
        message={notification.message || ""}
        color={notification.color || ""}
        show={notification.show}
      />
      <main
        id="main-container"
        onMouseMove={() => {
          setNextTimeout(new Date(Date.now() + SESSION_TIMEOUT));
        }}
        className="grid grid-cols-1 gap-[30px] h-full w-full p-[30px]"
      >
        <DashboardContext.Provider
          value={{
            sessionId: userData.sessionId,
            setNotification: setNotification,
            setNoteList: setNoteList,
          }}
        >
          {noteList.length ? (
            noteList.map((noteData, index) => {
              return (
                <NotePreview
                  title={noteData.title}
                  description={noteData.description}
                  modifiedAt={noteData.modifiedAt}
                  createdAt={noteData.createdAt}
                  noteId={noteData.noteId}
                  componentId={`note-${index}`}
                  key={index}
                />
              );
            })
          ) : (
            <div
              id="no-note-container"
              className="flex flex-col justify-center items-center gap-[10px]"
            >
              {notesLoading ? (
                <span>Loading notes...</span>
              ) : (
                <>
                  <span className="text-[30px]">No notes yet!</span>
                  <button
                    id="disconnect-button"
                    type="button"
                    className="bg-red-500 rounded-2xl text-white text-2xl pt-1 pb-1 pl-3 pr-3 hover:bg-red-900 active:bg-black"
                    onClick={() => {
                      //... Create note
                    }}
                  >
                    Create your first note
                  </button>
                </>
              )}
            </div>
          )}
        </DashboardContext.Provider>
        <button
          type="button"
          className="fixed bottom-[30px] right-[30px] w-[80px] bg-white border-[2px] rounded-[50%] shadow-xl hover:bg-gray-200 active:border-none"
          onClick={async () => {
            const response = await fetch(`${API_SERVER_URL}/api/note`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: userData.sessionId,
              },
              body: JSON.stringify({
                title: "Note de cours",
                description: "Petite description sur ma petite note rigolotte",
                createdAt: new Date(Date.now()),
                modifiedAt: new Date(),
              }),
            });

            if (response.ok) {
              const newNote = await response.json();
              setNoteList((noteList) => [newNote, ...noteList]);
              setNotification({
                message: "Created note successfully!",
                color: "green",
                show: true,
              });
            } else {
              setNotification({
                message: "Failed to create note!",
                color: "red",
                show: true,
              });
            }
            setTimeout(() => setNotification({ show: false }), 4000);
          }}
        >
          <img src={AddLogo} alt="Add" />
        </button>
      </main>
    </>
  );
}
