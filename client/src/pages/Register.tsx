import { SingleForm } from "../components/SingleForm";
import { Header } from "../components/Header";
import { Notification } from "../components/Notification";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IsSessionValid } from "../tools/SessionManager";
import { API_SERVER_URL } from "../main";

export default function Register() {
  const navigate = useNavigate();

  const [firstname, setFirstname] = useState({ value: "" } as {
    value: string;
    highlight: boolean;
  });
  const [lastname, setLastname] = useState({ value: "" } as {
    value: string;
    highlight: boolean;
  });
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

  useEffect(() => {
    const verifySession = async () => {
      if (await IsSessionValid()) navigate("/dashboard");
    };

    verifySession();
  }, [navigate]);

  const handleRegisterConnection = async () => {
    if (
      password.value.length &&
      username.value.length &&
      firstname.value.length &&
      lastname.value.length
    ) {
      const response = await fetch(`${API_SERVER_URL}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.value,
          password: password.value,
          firstname: firstname.value,
          lastname: lastname.value,
        }),
      });

      if (response.status == 500) {
        setUsername(({ value }) => ({
          value: value,
          errorMessage: "Already chosen!",
          highlight: true,
        }));
        setNotification({
          message: "Username already chosen!",
          color: "red",
          show: true,
        });
      } else if (!response.ok) {
        setNotification({
          message: "Failed to register!",
          color: "red",
          show: true,
        });
      } else {
        setNotification({
          message: "Account created successfully!",
          color: "green",
          show: true,
        });
        setTimeout(() => navigate("/login"), 2000);
      }

      setTimeout(() => {
        setNotification({ show: false });
      }, 4000);
    } else {
      setUsername(({ value }) => ({
        value: value,
        highlight: !username.value.length,
      }));
      setPassword(({ value }) => ({
        highlight: !password.value.length,
        value: value,
      }));
      setFirstname(({ value }) => ({
        highlight: !firstname.value.length,
        value: value,
      }));
      setLastname(({ value }) => ({
        highlight: !lastname.value.length,
        value: value,
      }));
    }
  };

  return (
    <>
      <Header />
      <main
        id="main-container"
        className="flex flex-row justify-center items-center h-[85vh] w-screen"
        onKeyDown={(event) =>
          event.key == "Enter" ? handleRegisterConnection() : ""
        }
      >
        <Notification
          message={notification.message || ""}
          color={notification.color || ""}
          show={notification.show}
        />
        <div
          id="left-container"
          className="flex flex-col border-solid border-2 border-r-0 p-6 h-[470px] w-[310px]"
        >
          <div id="sub-title-container" className="pb-3 text-3xl underline">
            Register
          </div>
          <SingleForm
            placeholder="First Name"
            title="First Name"
            value={firstname.value}
            highlight={firstname.highlight}
            onChange={(event) => {
              setFirstname({
                value: event.target.value,
                highlight: false,
              });
            }}
          />
          <SingleForm
            placeholder="Last Name"
            title="Last Name"
            value={lastname.value}
            highlight={lastname.highlight}
            onChange={(event) => {
              setLastname({
                value: event.target.value,
                highlight: false,
              });
            }}
          />
          <SingleForm
            placeholder="Username"
            title="Username"
            value={username.value}
            highlight={username.highlight}
            errorMessage={username.errorMessage}
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
            value={password.value}
            highlight={password.highlight}
            hideValue={true}
            onChange={(event) => {
              setPassword({
                value: event.target.value,
                highlight: false,
              });
            }}
          />
          <button
            id="sign-in-button"
            type="button"
            className="bg-red-500 rounded-2xl text-white text-2xl pt-1 pb-1 mt-3 hover:bg-red-900 active:bg-black"
            onClick={() => handleRegisterConnection()}
          >
            Register
          </button>
        </div>
        <div
          id="right-container"
          className="flex flex-col p-6 h-[470px] border border-l-0 bg-red-500 text-white justify-center items-center w-[350px]"
        >
          <div id="title-container" className="pb-3 text-2xl">
            Welcome to register
          </div>
          <div id="question-container" className="text-base pb-1">
            Already have an account?
          </div>
          <Link
            to="/login"
            id="register-button"
            type="button"
            className="border-2 rounded-2xl p-1 pr-2 pl-2 text-xl hover:bg-red-900 active:bg-black"
          >
            Login
          </Link>
        </div>
      </main>
    </>
  );
}
