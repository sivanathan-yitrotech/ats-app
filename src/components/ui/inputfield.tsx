import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

const InputField = ({
  label,
  name,
  placeholder,
  onChange,
  value,
  type,
  min,
  max,
  error,
}: {
  label: string;
  name: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  type?: string;
  min?: string;
  max?: string;
  error?: string;
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    if (type === "number") {
      // Allow only digits
      if (!/^\d*$/.test(inputValue)) return;

      // Enforce min/max length
      if (min && inputValue.length < parseInt(min)) return;
      if (max && inputValue.length > parseInt(max)) return;
    } else {
      // For text, enforce min/max length only
      if (max && inputValue.length > parseInt(max)) return;
    }

    onChange(e);
  };

  return (
    <div className="flex items-center gap-4">
      <Label className="text-[#1E293B] w-[30%]">{label}</Label>
      <div className="w-[70%] flex flex-col gap-0.5">
        <Input
          name={name}
          type={type} // Use text to fully control input
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className="placeholder:text-[12px] px-4 py-5"
        />
        {error && <p className="text-red-500 text-xs mt-1 ml-2">{error}</p>}
      </div>
    </div>
  );
};

export default InputField;
