import { useNavigate } from "react-router-dom";
import logo from "../assets/x.png";
import disconnectIMG from "../assets/switch.png";
import { Disconnect } from "../tools/SessionManager";
import "../styles/Header.css";

export const Header: React.FC<{
  isLogin?: boolean;
  firstName?: string;
  lastName?: string;
}> = ({ isLogin, firstName, lastName }) => {
  const navigate = useNavigate();
  return (
    <header className="z-20 flex flex-col sticky top-0 left-0">
      <div
        id="header-container"
        className="z-20 flex flex-row sticky top-0 left-0 h-[55px] border-b-[2px] border-gray-300 w-full justify-between text-2xl items-center bg-white"
      >
        <div
          id="left-header-container"
          className="flex flex-row items-center hover:cursor-pointer flex-shrink-0"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo" className="h-[40px] text-[30px]" />
          Secure Note X
        </div>
        {isLogin ? (
          <>
            <button
              id="header-disconnect-button"
              type="button"
              className="bg-red-500 rounded-2xl text-white text-2xl pt-1 pb-1 pl-3 pr-3 hover:bg-red-900 active:bg-black mr-[10px]"
              onClick={() => {
                Disconnect({
                  message: "Disconnected successfully!",
                  error: false,
                });
                navigate("/");
              }}
            >
              Disconnect
            </button>
            <img
              id="header-disconnect-image"
              src={disconnectIMG}
              alt="Disconnect"
              className="hidden h-[40px] mr-[10px] hover:cursor-pointer"
              onClick={() => {
                Disconnect({
                  message: "Disconnected successfully!",
                  error: false,
                });
                navigate("/");
              }}
            />
          </>
        ) : (
          <></>
        )}
      </div>
      {isLogin ? (
        <div
          id="connected-as-status"
          className="h-[30px] bg-white w-full border-b-[1px] px-[10px] border-gray-300 flex justify-between items-center shadow-md"
        >
          <div className="w-full truncate block">
            Connected as :
            <span className="text-blue-900">
              {" "}
              {firstName}, {lastName}
            </span>
          </div>
        </div>
      ) : (
        <></>
      )}
    </header>
  );
};
