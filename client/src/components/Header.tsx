import logo from "../assets/logo.jpg";

interface HeaderProps {
  isLogin?: boolean;
  firstName?: string;
  lastName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  isLogin,
  firstName,
  lastName,
}) => (
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
        >
          Disconnect
        </button>
      </div>
    ) : (
      <></>
    )}
  </header>
);
