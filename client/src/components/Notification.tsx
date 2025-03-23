import RedCross from "../assets/Cross_red_circle.svg";
import GreenCheck from "../assets/Green-Checklist.png";

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
          className={`${colorClass[color]} z-50 bg-white fixed right-[0px] top-[90px] border-2 border-l-[10px] flex flex-row items-center min-h-[60px] w-[230px] gap-2 p-[4px]`}
        >
          <img
            src={color == "red" ? RedCross : GreenCheck}
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
