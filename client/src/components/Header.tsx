import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const API_SERVER_URL = String(import.meta.env["VITE_API_SERVER"]);

export const Header: React.FC<{
  isLogin?: boolean;
  firstName?: string;
  lastName?: string;
}> = ({ isLogin, firstName, lastName }) => {
  const navigate = useNavigate();
  return (
    <header
      id="header-container"
      className="flex flex-row absolute top-0 left-0 h-[60px] border-b w-full shadow-md justify-between text-2xl items-center"
    >
      <div id="left-header-container" className="flex flex-row items-center">
        <img src={logo} alt="logo" className="h-[40px] text-[30px]" />
        Xako-Notes.inc
      </div>
      {isLogin ? (
        <div
          id="login-status-container"
          className="flex flex-row mr-2 gap-2 justify-center items-center"
        >
          Welcome {firstName}, {lastName}
          <button
            id="disconnect-button"
            type="button"
            className="bg-red-500 rounded-2xl text-white text-2xl pt-1 pb-1 pl-3 pr-3 hover:bg-red-900 active:bg-black"
            onClick={async () => {
              const sessionId = JSON.parse(
                localStorage.getItem("data") as string
              ).sessionId as string;
              await fetch(`${API_SERVER_URL}/api/logout`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  sessionId: sessionId,
                }),
              });
              localStorage.removeItem("data");
              sessionStorage.setItem("status", "Disconnected successfully!");
              navigate("/login");
            }}
          >
            Disconnect
          </button>
        </div>
      ) : (
        <></>
      )}
    </header>
  );
};
