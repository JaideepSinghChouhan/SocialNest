// src/components/ui/Input.jsx
import React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef((props, ref) => {
  return (
    <input
      ref={ref}
      {...props}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm",
        props.className
      )}
    />
  );
});

Input.displayName = "Input";

export default Input;
