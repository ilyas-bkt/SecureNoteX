import { SingleForm } from "../components/SingleForm";
import { Header } from "../components/Header";
import { Notification } from "../components/Notification";
import { Navigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";

const API_SERVER_URL = String(import.meta.env["VITE_API_SERVER"]);

export default function Register() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [firstNameError, setFirstNameError] = useState(Boolean);
  const [lastNameError, setLastNameError] = useState(Boolean);
  const [usernameError, setUsernameError] = useState(Boolean);
  const [passwordError, setPasswordError] = useState(Boolean);

  const [usernameWarn, setUsernameWarn] = useState(String);
  const [showNotification, setShowNotification] = useState(Boolean);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    setUsernameWarn("");
    setUsernameError(false);
  }, [username]);

  useEffect(() => {
    setFirstNameError(false);
  }, [firstname]);

  useEffect(() => {
    setLastNameError(false);
  }, [lastname]);

  useEffect(() => {
    setPasswordError(false);
  }, [password]);

  return (
    <main
      id="main-container"
      className="flex flex-row justify-center items-center h-screen w-screen"
    >
      <Header />
      <Notification message="Account created!" show={showNotification} />
      <div
        id="left-container"
        className="flex flex-col border-solid border-2 border-r-0 p-6 h-[470px] w-[310px]"
      >
        <div id="sub-title-container" className="pb-3 text-3xl underline">
          Register
        </div>
        <SingleForm
          id="firstname-data-container"
          placeholder="First Name"
          title="First Name"
          fun={(e: React.ChangeEvent<HTMLInputElement>) => {
            setFirstName(e.target.value);
          }}
          value={firstname}
          error={firstNameError}
        />
        <SingleForm
          id="lastname-data-container"
          placeholder="Last Name"
          title="Last Name"
          fun={(e: React.ChangeEvent<HTMLInputElement>) => {
            setLastName(e.target.value);
          }}
          value={lastname}
          error={lastNameError}
        />
        <SingleForm
          id="username-data-container"
          placeholder="Username"
          title="Username"
          fun={(e: React.ChangeEvent<HTMLInputElement>) => {
            setUsername(e.target.value);
          }}
          value={username}
          error={usernameError}
          warn={usernameWarn}
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
          hide={true}
        />
        <button
          id="sign-in-button"
          type="button"
          className="bg-red-500 rounded-2xl text-white text-2xl pt-1 pb-1 mt-3 hover:bg-red-900 active:bg-black"
          onClick={() => {
            if (password.length === 0) {
              setPasswordError(true);
            }
            if (firstname.length === 0) {
              setFirstNameError(true);
            }
            if (lastname.length === 0) {
              setLastNameError(true);
            }
            if (username.length === 0) {
              setUsernameError(true);
            }
            if (firstname && lastname && username && password) {
              fetch(`${API_SERVER_URL}/api/register`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  firstname: firstname,
                  lastname: lastname,
                  username: username,
                  password: password,
                }),
              })
                .then((response) => {
                  if (response.status === 500)
                    setUsernameWarn("Already exists");
                  else if (response.status === 201) {
                    setShowNotification(true);
                    setTimeout(() => {
                      setIsRegistered(true);
                    }, 1000);
                  }
                })
                .catch((error) => {
                  console.log("Failed to fetch :", error);
                });
            }
          }}
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
      {isRegistered ? <Navigate to={"/login"} /> : <></>}
    </main>
  );
}
