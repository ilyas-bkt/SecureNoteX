import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import {
  Disconnect,
  IsSessionValid,
  LoadLocalStorage,
  UpdateLocalStorage,
} from "../tools/SessionManager";
import AddLogo from "../assets/plus.png";
import { NotePreview } from "../components/NotePreview";
import { DashboardContext } from "../tools/DashboardContext";
import { API_SERVER_URL } from "../main";
import { Notification } from "../components/Notification";

export default function Dashboard() {
  const navigate = useNavigate();
  const [pageLoading, setPageLoading] = useState(true);
  const [userData, setUserData] = useState(
    {} as {
      firstname: string;
      lastname: string;
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
    const prefetchPage = async () => {
      if (!(await IsSessionValid())) {
        navigate("/login");
      }

      const isLocalDataLoaded = await UpdateLocalStorage();
      if (!isLocalDataLoaded) {
        Disconnect({ message: "Unable to load account data!", error: true });
        navigate("/login");
      }

      setUserData(LoadLocalStorage().user);
      setNoteList(LoadLocalStorage().note);
      setPageLoading(false);
    };

    prefetchPage();
  }, [navigate]);

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
        className="grid grid-cols-1 gap-[30px] h-full w-full p-[30px]"
      >
        <DashboardContext.Provider
          value={{
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
            </div>
          )}
        </DashboardContext.Provider>
        <button
          type="button"
          className="fixed bottom-[30px] right-[30px] w-[80px] bg-white border-[2px] rounded-[50%] shadow-xl hover:bg-gray-200 active:border-none"
          onClick={async () => {
            const response = await fetch(`${API_SERVER_URL}/api/note`, {
              method: "POST",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
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
              UpdateLocalStorage();
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
