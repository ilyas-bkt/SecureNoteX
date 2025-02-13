import RedCross from "../assets/Cross_red_circle.svg";
import GreenCHeck from "../assets/Green-Checklist.png";

export const Notification: React.FC<{
  message: string;
  show: boolean;
  color: string;
}> = ({ message, show, color }) => {
  const Color = color;
  return (
    <>
      {show ? (
        <div
          id="notification-container"
          className={`absolute right-[0px] top-[90px] border-${Color}-500 border-2 border-l-[10px] text-${color}-500 flex flex-row items-center min-h-[60px] w-[230px] gap-2 p-[2px] text-${Color}-600`}
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
