import React from "react";

export const SingleForm: React.FC<{
  placeholder: string;
  title: string;
  value: string;
  highlight: boolean;
  errorMessage?: string;
  hideValue?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({
  title,
  placeholder,
  value,
  highlight,
  errorMessage,
  hideValue,
  onChange,
}) => {
  return (
    <div className={`flex flex-col text-xl ${highlight ? "pb-2" : "pb-3"}`}>
      <div className="flex flex-row justify-between items-end">
        {title}
        <span className="gap-3 font-['Roboto'] text-sm text-red-500 font-bold">
          {errorMessage}
        </span>
      </div>
      <input
        type={hideValue ? "password" : "text"}
        title={placeholder}
        placeholder={placeholder}
        className={`bg-gray-200 font-['Roboto'] p-1 pr-2 pl-3 rounded-xl outline-none ${
          highlight || errorMessage ? "border-2 border-red-600" : "border-none"
        }`}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
