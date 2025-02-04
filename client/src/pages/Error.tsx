import { Header } from "../components/Header";
import { Link } from "react-router-dom";

export default function Error() {
  return (
    <main
      id="main-container"
      className="flex flex-col justify-center items-center h-screen w-screen gap-1 text-5xl"
    >
      <Header />
      Page not found
      <Link
        to="/"
        type="button"
        className="bg-red-500 rounded-2xl text-white text-2xl pt-1 pb-1 pr-3 pl-3 mt-3 hover:bg-red-900 active:bg-black"
      >
        Go back home
      </Link>
    </main>
  );
}
