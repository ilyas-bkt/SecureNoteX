import React from "react";

interface SingleFormProps {
  id: string;
  placeholder: string;
  title: string;
  fun: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  error: boolean;
  warn?: string;
  hide?: boolean;
}

export const SingleForm: React.FC<SingleFormProps> = ({
  id,
  title,
  placeholder,
  value,
  fun,
  error,
  warn,
  hide,
}) => {
  return (
    <div className={`flex flex-col text-xl ${error ? "pb-2" : "pb-3"}`}>
      <div className="flex flex-row justify-between items-end">
        {title}
        <span className="gap-3 font-['Roboto'] text-sm text-red-500 font-bold">
          {warn}
        </span>
      </div>
      <input
        id={id}
        type={hide ? "password" : "text"}
        title={placeholder}
        placeholder={placeholder}
        className={`bg-gray-200 font-['Roboto'] p-1 pr-2 pl-3 rounded-xl outline-none ${
          error || warn ? "border-2 border-red-600" : "border-none"
        }`}
        value={value}
        onChange={(e) => {
          fun(e);
        }}
      />
    </div>
  );
};
