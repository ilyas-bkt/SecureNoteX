import { SingleForm } from "../components/SingleForm";
import { Header } from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Notification } from "../components/Notification";
import { IsSessionValid } from "../tools/SessionManager";
import LoadingIMG from "../assets/colorful_loader.gif";
import { API_SERVER_URL } from "../main";


export default function Login() {
  const [username, setUsername] = useState(String);
  const [password, setPassword] = useState(String);

  const [usernameError, setUsernameError] = useState(Boolean);
  const [passwordError, setPasswordError] = useState(Boolean);

  const [usernameWarn, setUsernameWarn] = useState(String);
  const [passwordWarn, setPasswordWarn] = useState(String);

  const [loading, setLoading] = useState(false);
  const [notification, setNotifaction] = useState(
    {} as {
      message?: string;
      color?: string;
      show: boolean;
    }
  );

  const navigate = useNavigate();

  useEffect(() => {
    setUsernameError(false);
    setUsernameWarn("");
  }, [username]);

  useEffect(() => {
    setPasswordError(false);
    setPasswordWarn("");
  }, [password]);

  useEffect(() => {
    IsSessionValid().then((isValid) => {
      if (isValid) navigate("/dashboard");
    });

    const status = sessionStorage.getItem("status") as string;
    switch (status) {
      case "Disconnected successfully!":
        setNotifaction({
          message: "Disconnected successfully!",
          color: "green",
          show: true,
        });
        break;
      case "Session expired!":
        setNotifaction({
          message: "Session expired!",
          color: "red",
          show: true,
        });
        break;
      case "Timeout reached!":
        setNotifaction({
          message: "Timeout reached!",
          color: "red",
          show: true,
        });
        break;
    }

    setTimeout(() => {
      sessionStorage.clear();
      setNotifaction({
        show: false,
      });
    }, 4000);
  }, [navigate]);

  const handleConnection = async () => {
    setUsernameError(false);
    setUsernameWarn("");
    setPasswordError(false);
    setPasswordWarn("");
    setLoading(true);

    if (!password.length || !username.length) {
      setPasswordError(true);
      setUsernameError(true);
      setLoading(false);
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

      if (!response.ok) {
        setUsernameWarn("Incorrect");
        setPasswordWarn("Incorrect");
        setNotifaction({
          message: "Failed to connect!",
          color: "red",
          show: true,
        });
        setLoading(false);
        return;
      }

      const userData = await response.json();
      localStorage.setItem("data", JSON.stringify(userData));
      navigate("/dashboard");
    }
  };

  return (
    <>
      <Header />
      <main
        id="main-container"
        className="flex flex-row justify-center items-center h-[85vh] w-screen"
        onKeyDown={(event) => (event.key == "Enter" ? handleConnection() : "")}
      >
        <Notification
          message={notification.message || ""}
          color={notification.color || ""}
          show={notification.show}
        />
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
            onClick={() => handleConnection()}
          >
            Login
          </button>
          {loading ? (
            <div
              id="loading-container"
              className="flex flex-row gap-2 h-[27px] justify-center items-center"
            >
              <img src={LoadingIMG} alt="LoadingIMG" className="h-[80%]" />
              Connecting...
            </div>
          ) : (
            <></>
          )}
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
    </>
  );
}
