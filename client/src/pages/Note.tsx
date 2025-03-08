import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import {
  Disconnect,
  IsSessionValid,
  LoadLocalStorage,
  UpdateLocalStorage,
} from "../tools/SessionManager";
import { API_SERVER_URL } from "../main";
import { NoteContext } from "../tools/NoteContext";
import { PrimeReactProvider } from "primereact/api";
import { Editor } from "primereact/editor";

const AUTO_SAVE_INTERVAL_MS = 2000;

export default function Note() {
  const navigate = useNavigate();
  const { noteId } = useParams<{ noteId: string }>();
  const [pageLoading, setPageLoading] = useState(true);
  const [documentEdited, setDocumentEdited] = useState(false);
  const [savingStatus, setSavingStatus] = useState("Loaded");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [nextSaving, setNextSaving] = useState(Date.now() + 2 * 1000);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [noteBody, setNoteBody] = useState("");
  const [userData, setUserData] = useState<{
    firstname: string;
    lastname: string;
    username: string;
  }>();
  const [noteData, setNoteData] = useState(
    {} as {
      title: string;
    }
  );

  useEffect(() => {
    const prefetchPage = async () => {
      if (
        LoadLocalStorage().user &&
        LoadLocalStorage().note &&
        localStorage.getItem(noteId as string)
      ) {
        setUserData(LoadLocalStorage().user);
        setNoteBody(
          JSON.parse(localStorage.getItem(noteId as string) as string).body
        );
        const noteList = LoadLocalStorage().note;
        for (let i = 0; i < noteList.length; i++) {
          if (noteList[i].noteId == noteId) {
            setNoteData(noteList[i]);
            break;
          }
        }

        setPageLoading(false);
      }

      if (!(await IsSessionValid())) {
        Disconnect({ message: "Invalid session!", error: true });
        navigate("/login");
      }

      const isLocalDataLoaded = await UpdateLocalStorage();
      if (!isLocalDataLoaded) {
        Disconnect({ message: "Unable to load account data!", error: true });
        navigate("/login");
      }

      const response = await fetch(
        `${API_SERVER_URL}/api/note/body/${noteId}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.setItem(
          noteId as string,
          JSON.stringify(await response.json())
        );
        setNoteBody(
          JSON.parse(localStorage.getItem(noteId as string) as string).body
        );
      } else {
        Disconnect({ message: "Unable to load account data!", error: true });
        navigate("/login");
      }

      setPageLoading(false);
    };

    prefetchPage();
  }, [navigate, noteId]);

  useEffect(() => {
    if (!documentEdited) return;
    setSavingStatus("Modified");
    setSaved(false);
    setNextSaving(Date.now() + AUTO_SAVE_INTERVAL_MS);
  }, [noteBody, documentEdited]);

  useEffect(() => {
    if (saving && !saved) {
      const handleSaveNoteBody = async () => {
        const response = await fetch(
          `${API_SERVER_URL}/api/note/body/${noteId}`,
          {
            method: "PATCH",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              noteBody: noteBody,
            }),
          }
        );

        if (response.ok) setSavingStatus("Saved");
        else setSavingStatus("Error while saving");

        setSaving(false);
        setSaved(true);
      };
      handleSaveNoteBody();
    }
  }, [documentEdited, noteBody, noteId, saved, saving]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (documentEdited && !saving && !saved && currentTime > nextSaving) {
      setSavingStatus("Saving...");
      setSaving(true);
    }
  }, [saving, saved, currentTime, nextSaving, documentEdited]);

  return pageLoading ? (
    <>Loading...</>
  ) : (
    <NoteContext.Provider
      value={{ setNoteBody: setNoteBody, noteBody: noteBody }}
    >
      <Header
        isLogin={true}
        firstName={userData?.firstname}
        lastName={userData?.lastname}
      />
      <main className="h-[calc(100vh-100px);] flex flex-col justify-start items-center">
        <div
          id="note-status"
          className="h-[35px] w-full border-b-[1px] px-[10px] mt-[2px] border-gray-300 flex justify-between items-center"
        >
          <div className="w-[50%] truncate block">
            Current note :
            <span className="text-blue-900"> {noteData.title}</span>
          </div>
          <div className="flex flex-row justify-center items-center gap-[10px]">
            <div>
              Status :{" "}
              <span
                className={
                  savingStatus == "Loaded"
                    ? "text-blue-900"
                    : savingStatus == "Modified" || savingStatus == "Saving..."
                    ? "text-orange-500"
                    : savingStatus == "Saved"
                    ? "text-green-500"
                    : "text-red-600"
                }
              >
                {" "}
                {savingStatus}
              </span>
            </div>
            <Link
              to="/dashboard"
              className="bg-white border-[2px] px-[5px] h-[25px] border-red-500 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white active:bg-black active:border-white flex justify-center items-center"
            >
              Exit
            </Link>
          </div>
        </div>
        <PrimeReactProvider>
          <Editor
            value={noteBody}
            onTextChange={(event) => {
              setNoteBody(event.htmlValue || "");
              if (!documentEdited) setDocumentEdited(true);
            }}
            className="w-full h-[calc(100%-40px)] text-[]"
            style={{ fontSize: "18px", font: "Roboto" }}
          />
        </PrimeReactProvider>
      </main>
    </NoteContext.Provider>
  );
}
