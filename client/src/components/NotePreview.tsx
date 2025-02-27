import DeleteIcon from "../assets/delete-icon.png";
import EditIcon from "../assets/edit-icon.png";
import { API_SERVER_URL } from "../main";
import { useContext } from "react";
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

  return (
    <div
      id={`note-preview-container-${componentId}`}
      className="border-[2px] w-full rounded-[20px] p-[10px] pl-[20px] flex flex-row justify-between hover:bg-slate-200 hover:cursor-pointer hover:shadow-2xl"
      //onClick={() => navigate(`/notes/${noteId}`)}
    >
      <div id="note-left-container" className="flex flex-col max-w-[700px]">
        <span
          id={`note-title-${componentId}`}
          className="font-bold text-[30px]"
        >
          {title}
        </span>
        <span
          id={`note-description-${componentId}`}
          className="text-gray-700 text-[18px] "
        >
          {description}
        </span>
        <span id={`note-modified-at-${componentId}`} className="text-blue-900">
          Modified {modifiedAt}
        </span>
        <span id={`note-created-at-${componentId}`} className="text-blue-900">
          Created {createdAt}
        </span>
      </div>
      <div id="note-right-container" className="flex flex-col gap-[5px]">
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
          onClick={async () => {}}
        />
      </div>
    </div>
  );
};
