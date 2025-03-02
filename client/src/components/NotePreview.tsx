import DeleteIcon from "../assets/delete-icon.png";
import EditIcon from "../assets/edit-icon.png";
import LoadingGif from "../assets/colorful_loader.gif";
import { API_SERVER_URL } from "../main";
import { useContext, useEffect, useRef, useState } from "react";
import { DashboardContext } from "../tools/DashboardContext";
import { UpdateLocalStorage } from "../tools/SessionManager";

export const NotePreview: React.FC<{
  title: string;
  createdAt: string;
  modifiedAt: string;
  description?: string;
  noteId: string;
  componentId: string;
}> = ({ title, createdAt, modifiedAt, description, componentId, noteId }) => {
  const dashboardContext = useContext(DashboardContext);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionInputRef = useRef<HTMLInputElement>(null);
  const [editNote, setEditNote] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [noteTitle, setNoteTitle] = useState(title as string);
  const [noteDescription, setNoteDescription] = useState(description as string);
  const [noteModifiedAt, setNoteModifiedAt] = useState(modifiedAt);
  const [lastNoteData, setLastNoteData] = useState({
    title: title,
    description: description,
  } as { title: string; description: string });

  useEffect(() => {
    if (editNote) {
      descriptionInputRef.current?.focus();
      descriptionInputRef.current?.select();

      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [editNote]);

  const formatDate = (dateTime: string) => {
    const parsedDateTime = new Date(Date.parse(dateTime)).getTime();
    const currentDateTime = new Date().getTime();
    const timeDifference = currentDateTime - parsedDateTime;

    const days = timeDifference / (24 * 60 * 60 * 1000);
    const hours = timeDifference / (60 * 60 * 1000);
    const minutes = timeDifference / (60 * 1000);

    let timeAgo: { value: number; units: string };

    if (hours < 1) timeAgo = { value: Math.trunc(minutes), units: "minutes" };
    else if (days < 1) timeAgo = { value: Math.trunc(hours), units: "hours" };
    else timeAgo = { value: Math.trunc(days), units: "days" };

    return timeAgo.value
      ? `${timeAgo.value} ${
          timeAgo.value == 1 ? timeAgo.units.replace("s", " ") : timeAgo.units
        } ago`
      : "now";
  };

  const handleChanges = async () => {
    const response = await fetch(`${API_SERVER_URL}/api/note`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        noteId: noteId,
        title: noteTitle,
        description: noteDescription,
      }),
    });

    if (response.ok) {
      setSavingChanges(false);
      dashboardContext.setNotification({
        message: "Changes saved!",
        color: "green",
        show: true,
      });
      setTimeout(() => dashboardContext.setNotification({ show: false }), 3000);
      setLastNoteData({
        title: noteTitle,
        description: noteDescription,
      });
      setNoteModifiedAt(new Date().toISOString());
      UpdateLocalStorage();
    } else {
      setNoteTitle(lastNoteData.title);
      setNoteDescription(lastNoteData.description);
      dashboardContext.setNotification({
        message: "Unable to apply changes!",
        color: "red",
        show: true,
      });
      setSavingChanges(false);
      setTimeout(() => dashboardContext.setNotification({ show: false }), 3000);
    }
  };

  return (
    <div
      id={`note-preview-container-${componentId}`}
      className="border-[2px] w-full rounded-[20px] p-[10px] pl-[20px] flex flex-row justify-between hover:bg-slate-200 hover:cursor-pointer hover:shadow-2xl"
      //onClick={() => navigate(`/notes/${noteId}`)}
    >
      <div id="note-left-container" className="flex flex-col max-w-[80%]">
        <span
          id={`note-title-${componentId}`}
          className="font-bold text-[30px]"
        >
          {editNote ? (
            <input
              value={noteTitle}
              title="note-title"
              ref={titleInputRef}
              onChange={(event) => {
                setNoteTitle(event.target.value);
              }}
              className="rounded-lg pl-[4px] h-[34px] w-full border-[2px] outline-none bg-slate-100 italic"
            />
          ) : (
            noteTitle
          )}
        </span>
        <span
          id={`note-description-${componentId}`}
          className="text-[18px] text-blue-900"
        >
          {editNote ? (
            <input
              value={noteDescription}
              title="note-description"
              ref={descriptionInputRef}
              onChange={(event) => {
                setNoteDescription(event.target.value);
              }}
              className="rounded-lg pl-[4px] h-[24px] w-full border-[2px] outline-none bg-slate-100 italic"
            />
          ) : (
            noteDescription
          )}
        </span>
        <span
          id={`note-modified-at-${componentId}`}
          className="text-gray-700 font-['Roboto'] font-bold w-fit"
        >
          Modified {formatDate(noteModifiedAt)}
        </span>
        <span
          id={`note-created-at-${componentId}`}
          className="text-gray-700 font-['Roboto'] font-bold w-fit"
        >
          Created {formatDate(createdAt)}
        </span>
      </div>
      <div className="flex flex-col justify-between">
        <div
          id="note-right-container"
          className="flex flex-col gap-[5px] items-end"
        >
          <img
            src={DeleteIcon}
            alt="Delete"
            className="h-[35px] w-[35px] m-[2px] hover:h-[39px] hover:w-[39px] hover:m-0 active:opacity-50"
            onClick={async () => {
              const response = await fetch(`${API_SERVER_URL}/api/note`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  noteId: noteId,
                }),
              });

              if (response.ok) {
                dashboardContext.setNoteList((noteList) =>
                  noteList.filter((note) => note.noteId !== noteId)
                );
                dashboardContext.setNotification({
                  message: "Deleted note successfully!",
                  color: "green",
                  show: true,
                });
                UpdateLocalStorage();
              } else {
                dashboardContext.setNotification({
                  message: "Error while deleting note!",
                  color: "red",
                  show: true,
                });
              }
              setTimeout(
                () => dashboardContext.setNotification({ show: false }),
                4000
              );
            }}
          />
          <img
            src={EditIcon}
            alt="Edit"
            className="h-[35px] w-[35px] m-[2px] hover:h-[39px] hover:w-[39px] hover:m-0 active:opacity-50"
            onClick={() => setEditNote(true)}
          />
        </div>
        <div
          id="save-message-container"
          className="flex flex-row gap-[3px] justify-center items-center"
        >
          {editNote ? (
            <button
              type="button"
              className="rounded-lg bg-green-500 border-[2px] hover:bg-white text-white hover:border-[2px] hover:border-green-500 px-[5px] hover:text-green-500 active:text-white active:bg-black active:border-white"
              onClick={() => {
                setSavingChanges(true);
                setEditNote(false);
                handleChanges();
              }}
            >
              Save changes
            </button>
          ) : savingChanges ? (
            <>
              <img
                src={LoadingGif}
                alt="green-check"
                className="h-[22px] w-[22px]"
              />
              Saving...
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
