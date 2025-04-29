import React, { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import clsx from "clsx";

type TagsInputProps = {
  value?: string[];
  onChange?: (tags: string[]) => void;
  placeholder?: string;
};

export const TagsInput: React.FC<TagsInputProps> = ({
  value = [],
  onChange,
  placeholder = "Add a tag",
}) => {
  const [tags, setTags] = useState<string[]>(value);
  const [input, setInput] = useState("");

  const addTag = (tag: string) => {
    const newTag = tag.trim();
    if (newTag && !tags.includes(newTag)) {
      const newTags = [...tags, newTag];
      setTags(newTags);
      onChange?.(newTags);
    }
    setInput("");
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
    onChange?.(newTags);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (["Enter", ","].includes(e.key)) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === "Backspace" && !input && tags.length) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div
      className={clsx(
        "flex flex-wrap items-center gap-2 p-2 border rounded-md bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700",
        "focus-within:ring-0 focus-within:outline-none w-full"
      )}
    >
      {tags.map((tag, index) => (
        <span
          key={index}
          className="flex items-center gap-1 bg-blue-100 dark:bg-blue-800 text-sm px-2 py-1 rounded-full text-blue-800 dark:text-blue-200 transition-all duration-200 hover:bg-blue-200 dark:hover:bg-blue-700"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-1 text-zinc-500 hover:text-red-500 transition-colors duration-200"
            aria-label={`Remove tag ${tag}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Tag input"
        className={clsx(
          "flex-1 min-w-[100px] px-2 py-1 w-auto bg-transparent text-[12px] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 placeholder:text-[12px]",
          "border-none outline-none focus:outline-none focus:ring-0"
        )}
      />
    </div>
  );
};
