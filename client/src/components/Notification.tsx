import CheckIMG from "../assets/Green-Checklist.png";

interface NotificationProps {
  message: string;
  show: boolean;
}

export const Notification: React.FC<NotificationProps> = ({
  message,
  show,
}) => {
  return (
    <>
      {show ? (
        <div
          id="notification-container"
          className="absolute right-[0px] top-[90px] border-2 border-green-500 border-l-[10px] text-green-500 flex flex-row items-center min-h-[60px] w-[200px] gap-2"
        >
          <img src={CheckIMG} alt="Check logo" className="h-[40px] ml-2" />
          {message}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
