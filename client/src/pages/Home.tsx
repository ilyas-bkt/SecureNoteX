import { Header } from "../components/Header";
import NoteTakingHome from "../assets/note-taking-home.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Notification } from "../components/Notification";

export default function Home() {
  const [notification, setNotification] = useState(
    {} as {
      message?: string;
      color?: string;
      show: boolean;
    }
  );

  useEffect(() => {
    const disconnectStatus: { message: string; error: boolean } = JSON.parse(
      sessionStorage.getItem("status") as string
    );

    if (disconnectStatus) {
      setNotification({
        message: disconnectStatus.message,
        color: disconnectStatus.error ? "red" : "green",
        show: true,
      });
    }

    setTimeout(() => {
      sessionStorage.clear();
      localStorage.clear();
      setNotification({
        show: false,
      });
    }, 4000);
  }, []);

  return (
    <>
      <Notification
        message={notification.message || ""}
        color={notification.color || ""}
        show={notification.show}
      />
      <Header />
      <main className="w-full flex justify-center">
        <div className="w-full max-w-[1200px] h-[600px] flex flex-row justify-center items-center">
          <div className="flex flex-col justify-center min-w-[600px] gap-[5px]">
            <span className="text-center text-[70px] leading-[60px]">
              Welcome to Secure Note X
            </span>
            <span className="text-center text-[18px] text-slate-500">
              The most secure and trustworthy taking note platform
            </span>
            <div className="flex justify-center items-center gap-[20px]">
              <Link
                id="login-button"
                type="button"
                className="text-center bg-red-500 rounded-2xl text-white border-[3px] border-red-500 text-2xl w-[300px] pt-1 pb-1 pl-3 pr-3 hover:bg-red-900 hover:border-red-900 active:bg-black active:border-white"
                to={"/login"}
              >
                I have an account
              </Link>
              <Link
                id="register-button"
                type="button"
                className="text-center bg-white rounded-2xl text-red-500 border-[3px] border-red-500 text-2xl w-[300px] pt-1 pb-1 pl-3 pr-3 hover:bg-gray-300 active:bg-black active:text-white active:border-white"
                to={"/register"}
              >
                I am new here
              </Link>
            </div>
          </div>
          <div className="h-full w-full">
            <img
              src={NoteTakingHome}
              className="h-full"
              alt="note-taking-image"
            />
          </div>
        </div>
      </main>
      <footer className="border-t-[2px] h-[100px] w-full border-gray-300 flex bg-gray-100 flex-col justify-center items-center fixed bottom-0 text-gray-500">
        <span>
          **THIS IS NOT AN OFFICIAL WEBSITE – FOR EDUCATIONAL PURPOSES ONLY**
        </span>
        <a
          href="https://www.linkedin.com/in/ilyas-bouktrane/"
          className="text-blue-700 underline"
        >
          Creator's LinkedIn
        </a>
      </footer>
    </>
  );
}
