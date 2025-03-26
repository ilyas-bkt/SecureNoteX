import { SingleForm } from "../components/SingleForm";
import { Header } from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Notification } from "../components/Notification";
import { IsSessionValid } from "../tools/SessionManager";
import LoadingIMG from "../assets/colorful_loader.gif";
import { API_SERVER_URL } from "../main";
import { z } from "zod";
import "../styles/Login.css"

export default function Login() {
  const navigate = useNavigate();

  const [password, setPassword] = useState({ value: "" } as {
    value: string;
    highlight: boolean;
    errorMessage?: string;
  });
  const [username, setUsername] = useState({ value: "" } as {
    value: string;
    highlight: boolean;
    errorMessage?: string;
  });
  const [notification, setNotification] = useState(
    {} as {
      message?: string;
      color?: string;
      show: boolean;
    }
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const verifySession = async () => {
      if (await IsSessionValid()) navigate("/dashboard");
    };

    const disconnectStatus: { message: string; error: boolean } = JSON.parse(
      sessionStorage.getItem("status") as string
    );

    if (disconnectStatus) {
      setNotification({
        message: disconnectStatus.message,
        color: disconnectStatus.error ? "red" : "green",
        show: true,
      });
    } else verifySession();

    setTimeout(() => {
      sessionStorage.clear();
      localStorage.clear();
      setNotification({
        show: false,
      });
    }, 4000);
  }, [navigate]);

  const handleLoginConnection = async () => {
    if (username.value.length && password.value.length) {
      setLoading(true);
      const userSchema = z.object({
        username: z
          .string()
          .min(2, "Wrong username")
          .max(15, "Too big")
          .trim()
          .regex(/^[a-zA-Z0-9\s]+$/, "Wrong username"),
        password: z.string().min(8, "Wrong password").max(15, "Too big").trim(),
      });
      const userData = {
        username: username.value,
        password: password.value,
      };

      const result = userSchema.safeParse(userData);
      if (!result.success && result.error) {
        const error = result.error.flatten().fieldErrors;
        setUsername((username) => ({
          value: username.value,
          highlight: error.username ? true : false,
          errorMessage: error.username ? error.username[0] : "",
        }));
        setPassword((password) => ({
          value: password.value,
          highlight: error.password ? true : false,
          errorMessage: error.password ? error.password[0] : "",
        }));

        setLoading(false);
        return;
      }

      const response = await fetch(`${API_SERVER_URL}/api/user/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        setUsername(({ value }) => ({
          value: value,
          highlight: true,
          errorMessage: "Incorrect!",
        }));
        setPassword(() => ({
          value: "",
          highlight: true,
          errorMessage: "Incorrect!",
        }));
        setNotification({
          message: "Failed to connect!",
          color: "red",
          show: true,
        });
        setTimeout(() => setNotification({ show: false }), 4000);
        setLoading(false);
      } else {
        navigate("/dashboard");
      }
    } else {
      setUsername(({ value }) => ({
        value: value,
        highlight: !username.value.length,
      }));
      setPassword(({ value }) => ({
        value: value,
        highlight: !password.value.length,
      }));
    }
  };

  return (
    <>
      <Header />
      <main
        id="login-main-container"
        className="flex flex-row justify-center items-center h-[calc(100vh-60px);] w-screen"
        onKeyDown={(event) =>
          event.key == "Enter" ? handleLoginConnection() : ""
        }
      >
        <Notification
          message={notification.message || ""}
          color={notification.color || ""}
          show={notification.show}
        />
        <div
          id="left-container"
          className="flex flex-col border-gray-200 border-2 border-r-0 p-6 h-[330px] w-[310px]"
        >
          <div id="sub-title-container" className="pb-3 text-3xl underline">
            Login
          </div>
          <SingleForm
            placeholder="Username"
            title="Username"
            value={username.value || ""}
            errorMessage={username.errorMessage || ""}
            highlight={username.highlight}
            onChange={(event) => {
              setUsername({
                value: event.target.value,
                highlight: false,
                errorMessage: "",
              });
            }}
          />
          <SingleForm
            placeholder="Password"
            title="Password"
            value={password.value || ""}
            highlight={password.highlight}
            errorMessage={password.errorMessage || ""}
            hideValue={true}
            onChange={(event) => {
              setPassword({
                value: event.target.value,
                highlight: false,
                errorMessage: "",
              });
            }}
          />
          <button
            id="sign-in-button"
            type="button"
            className="bg-red-500 rounded-2xl text-white text-2xl pt-1 pb-1 mt-3 hover:bg-red-900 active:bg-black"
            onClick={() => handleLoginConnection()}
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
          className="flex flex-col p-6 h-[330px] border border-l-0 bg-red-500 text-white justify-center items-center w-full max-w-[350px]"
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
            className="border-2 rounded-2xl p-1 pr-2 pl-2 text-xl w-full max-w-[130px] text-center hover:bg-red-900 active:bg-black"
          >
            Register
          </Link>
        </div>
      </main>
    </>
  );
}
