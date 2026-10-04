import React from "react";
import { getImageUrl } from "../../config/image";

const Avatar = ({ src, name = "User", size = "md" }) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
    xl: "h-20 w-20 text-2xl",
  };

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <div
      className={`flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-100 font-bold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 ${sizes[size] || sizes.md}`}
    >
      {src ? (
        <img
          src={getImageUrl(src)}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        initials || "U"
      )}
    </div>
  );
};

export default Avatar;
