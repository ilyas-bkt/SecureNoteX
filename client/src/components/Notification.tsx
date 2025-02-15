import RedCross from "../assets/Cross_red_circle.svg";
import GreenCHeck from "../assets/Green-Checklist.png";

export const Notification: React.FC<{
  message: string;
  show: boolean;
  color: string;
}> = ({ message, show, color }) => {
  const colorClass: Record<string, string> = {
    red: "border-red-500 text-red-500 text-red-600",
    green: "border-green-500 text-green-500 text-green-600",
  };
  return (
    <>
      {show ? (
        <div
          id="notification-container"
          className={`${colorClass[color]} absolute right-[0px] top-[90px] border-2 border-l-[10px] flex flex-row items-center min-h-[60px] w-[230px] gap-2 p-[2px]`}
        >
          <img
            src={color == "red" ? RedCross : GreenCHeck}
            alt="Check logo"
            className="h-[40px] ml-2"
          />
          {message}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
