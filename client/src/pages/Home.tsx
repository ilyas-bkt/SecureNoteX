import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Notification } from "../components/Notification";
import "../styles/Home.css";

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
      <main className="w-full h-full flex flex-col justify-center items-center">
        <div
          id="main-container"
          className="w-full max-w-[1200px] min-h-[600px] h-full flex flex-col justify-center items-center p-[50px]"
        >
          <span
            id="home-title-container"
            className="text-center text-[70px] leading-[60px]"
          >
            Welcome to Secure Note X
          </span>
          <span
            id="home-description-container-left"
            className="text-center text-[18px] text-blue-900 max-w-[1000px] mt-[10px]"
          >
            Take notes securely, anytime, anywhere. SecureNoteX is a modern
            platform that combines simplicity, real-time collaboration, and
            advanced security to protect your data.
          </span>
          <div
            id="home-buttons"
            className="flex justify-center items-center gap-[20px] mt-[10px]"
          >
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
        <footer className="border-t-[2px] h-[100px] w-full border-gray-300 flex bg-gray-100 flex-col justify-center items-center text-gray-500">
          <span className="text-center">
            **THIS IS NOT AN OFFICIAL WEBSITE – FOR EDUCATIONAL PURPOSES ONLY**
          </span>
          <a
            href="https://www.linkedin.com/in/ilyas-bouktrane/"
            className="text-blue-700 underline"
          >
            Creator's LinkedIn
          </a>
        </footer>
      </main>
    </>
  );
}
