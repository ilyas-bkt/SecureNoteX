import { SingleForm } from "../components/SingleForm";
import { Header } from "../components/Header";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Notification } from "../components/Notification";

const API_SERVER_URL = String(import.meta.env["VITE_API_SERVER"]);

export default function Login() {
  const [username, setUsername] = useState(String);
  const [password, setPassword] = useState(String);

  const [usernameError, setUsernameError] = useState(Boolean);
  const [passwordError, setPasswordError] = useState(Boolean);

  const [usernameWarn, setUsernameWarn] = useState(String);
  const [passwordWarn, setPasswordWarn] = useState(String);

  const [showNotification, setShowNotification] = useState(Boolean);

  useEffect(() => {
    setUsernameError(false);
    setUsernameWarn("");
  }, [username]);

  useEffect(() => {
    setPasswordError(false);
    setPasswordWarn("");
  }, [password]);

  return (
    <main
      id="main-container"
      className="flex flex-row justify-center items-center h-screen w-screen"
    >
      <Header />
      <Notification message="Logged In!" show={showNotification} />
      <div
        id="left-container"
        className="flex flex-col border-solid border-2 border-r-0 p-6 h-[330px]"
      >
        <div id="sub-title-container" className="pb-3 text-3xl underline">
          Login
        </div>
        <SingleForm
          id="username-data-container"
          placeholder="Username"
          title="Username"
          fun={(e: React.ChangeEvent<HTMLInputElement>) => {
            setUsername(e.target.value);
          }}
          value={username}
          warn={usernameWarn}
          error={usernameError}
        />
        <SingleForm
          id="password-data-container"
          placeholder="Password"
          title="Password"
          fun={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPassword(e.target.value);
          }}
          value={password}
          error={passwordError}
          warn={passwordWarn}
          hide={true}
        />
        <button
          id="sign-in-button"
          type="button"
          className="bg-red-500 rounded-2xl text-white text-2xl pt-1 pb-1 mt-3 hover:bg-red-900 active:bg-black"
          onClick={async () => {
            setUsernameError(false);
            setUsernameWarn("");
            setPasswordError(false);
            setPasswordWarn("");

            if (!password.length || !username.length) {
              setPasswordError(true);
              setUsernameError(true);
            } else if (!usernameError && !passwordError) {
              const response = await fetch(`${API_SERVER_URL}/api/login`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: username,
                  password: password,
                }),
              });

              switch (response.status) {
                case 400:
                  setUsernameWarn("Incorrect");
                  setPasswordWarn("Incorrect");
                  return;
                case 202:
                  setShowNotification(true);
                  console.log(response);
                  break;
              }
            }
          }}
        >
          Login
        </button>
      </div>
      <div
        id="right-container"
        className="flex flex-col p-6 h-[330px] border border-l-0 bg-red-500 text-white justify-center items-center w-[330px]"
      >
        <div id="title-container" className="pb-3 text-2xl">
          Welcome to login
        </div>
        <div id="question-container" className="text-base pb-1">
          Don't have an account?
        </div>
        <Link
          to={"/register"}
          id="register-button"
          type="button"
          className="border-2 rounded-2xl p-1 pr-2 pl-2 text-xl hover:bg-red-900 active:bg-black"
        >
          Register
        </Link>
      </div>
    </main>
  );
}
