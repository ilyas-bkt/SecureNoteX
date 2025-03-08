import LoadingGif from "../assets/colorful_loader.gif";

export const Loader: React.FC<{ message: string }> = ({ message }) => (
  <div id="loading" className="flex flex-row gap-[5px]">
    <img src={LoadingGif} alt="green-check" className="h-[22px] w-[22px]" />
    {message}
  </div>
);