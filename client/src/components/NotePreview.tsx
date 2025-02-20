import { useNavigate } from "react-router-dom";
import DeleteIcon from "../assets/delete-icon.png";
import EditIcon from "../assets/edit-icon.png";
import { API_SERVER_URL } from "../main";
import { useContext } from "react";
import { SessionContext } from "../tools/SessionContext";

export const NotePreview: React.FC<{
  title: string;
  createdAt: string;
  modifiedAt: string;
  description?: string;
  noteId: string;
}> = ({ title, createdAt, modifiedAt, description, noteId }) => {
  const navigate = useNavigate();
  const sessionId = useContext(SessionContext);

  return (
    <div
      id={`note-preview-container-${noteId}`}
      className="border-[2px] w-full rounded-[20px] p-[10px] pl-[20px] flex flex-row justify-between hover:bg-slate-200 hover:cursor-pointer hover:shadow-2xl"
      onClick={() => navigate(`/note/${noteId}`)}
    >
      <div id="note-left-container" className="flex flex-col max-w-[700px]">
        <span id={`note-title-${noteId}`} className="font-bold text-[30px]">
          {title}
        </span>
        <span
          id={`note-description-${noteId}`}
          className="text-gray-700 text-[18px] "
        >
          {description}
        </span>
        <span id={`note-modified-at-${noteId}`} className="text-blue-900">
          Modified {modifiedAt}
        </span>
        <span id={`note-created-at-${noteId}`} className="text-blue-900">
          Created {createdAt}
        </span>
      </div>
      <div id="note-right-container" className="flex flex-col gap-[5px]">
        <img
          src={DeleteIcon}
          alt="Delete"
          className="h-[35px] w-[35px] m-[2px] hover:h-[39px] hover:w-[39px] hover:m-0 active:opacity-50"
          onClick={async () => {
            const response = await fetch(`${API_SERVER_URL}/note/${noteId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: sessionId,
              },
            });

            if (response.ok) {
              //...
            }
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
