import { useContext, useState } from "react";
import { SingleForm } from "./SingleForm";
import { DashboardContext } from "../tools/DashboardContext";
import { API_SERVER_URL } from "../main";
import { UpdateLocalStorage } from "../tools/SessionManager";

export const NoteCreationPanel: React.FC<{ createNote: boolean }> = ({
  createNote,
}) => {
  const [title, setTitle] = useState({ value: "", highlight: false } as {
    value: string;
    highlight: boolean;
  });
  const [description, setDescription] = useState({
    value: "",
    highlight: false,
  } as {
    value: string;
    highlight: boolean;
  });
  const dashboardContext = useContext(DashboardContext);

  const handleCreatingNote = () => async () => {
    if (!title.value.length || !description.value.length) {
      setTitle(({ value }) => ({
        value: value,
        highlight: !value.length,
      }));
      setDescription(({ value }) => ({
        value: value,
        highlight: !value.length,
      }));
      return;
    }
    const response = await fetch(`${API_SERVER_URL}/api/note`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title.value,
        description: description.value,
        createdAt: new Date(),
        modifiedAt: new Date(),
      }),
    });

    if (response.ok) {
      const newNote = await response.json();
      dashboardContext.setNoteList((noteList) => [newNote, ...noteList]);
      dashboardContext.setNotification({
        message: "Created note successfully!",
        color: "green",
        show: true,
      });
      UpdateLocalStorage();
      setTitle({ value: "", highlight: false });
      setDescription({ value: "", highlight: false });
      dashboardContext.setCreateNote(false);
    } else {
      dashboardContext.setNotification({
        message: "Failed to create note!",
        color: "red",
        show: true,
      });
    }
    setTimeout(() => dashboardContext.setNotification({ show: false }), 4000);
  };

  return createNote ? (
    <div
      id="note-creation-panel-background-container"
      className="fixed bg-black bg-opacity-50 w-full h-screen z-10 flex justify-center items-center"
    >
      <div
        id="note-creation-panel-container"
        className="w-[400px] bg-white mb-[100px] rounded-xl flex flex-col text-[25px] p-[10px] px-[20px] pb-[20px]"
      >
        <span id="note-creation-panel-title">Create your note</span>
        <hr className="border-[1px] border-gray-600 mb-[10px]" />
        <SingleForm
          title="Title"
          placeholder="Give your note a title"
          value={title.value}
          highlight={title.highlight}
          onChange={(event) => {
            setTitle({
              value: event.target.value,
              highlight: false,
            });
          }}
        />
        <SingleForm
          title="Description"
          placeholder="Give your note a quick description"
          value={description.value}
          highlight={description.highlight}
          onChange={(event) => {
            setDescription({
              value: event.target.value,
              highlight: false,
            });
          }}
        />
        <div id="buttons" className="flex flex-row gap-[10px] mt-[10px]">
          <button
            id="cancel-note-button"
            type="button"
            className="w-full bg-red-500 rounded-2xl text-white text-2xl pt-1 pb-1 pl-3 pr-3 hover:bg-red-900 active:bg-black"
            onClick={() => dashboardContext.setCreateNote(false)}
          >
            Cancel
          </button>
          <button
            id="create-note-button"
            type="button"
            className="w-full text-red-500 rounded-2xl bg-white border-[3px] border-red-500 text-2xl pt-1 pb-1 pl-3 pr-3 hover:bg-gray-300 active:bg-black active:text-white active:border-white"
            onClick={handleCreatingNote()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};
