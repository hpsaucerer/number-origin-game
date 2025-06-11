"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export const Tooltip = ({ children, ...props }) => (
  <TooltipPrimitive.Provider>
    <TooltipPrimitive.Root {...props}>{children}</TooltipPrimitive.Root>
  </TooltipPrimitive.Provider>
);

export const TooltipTrigger = TooltipPrimitive.Trigger;

export const TooltipContent = ({ className = "", side = "top", ...props }) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      side={side}
      align="center"
      sideOffset={4}
      className={
        // bump z-index above the Dialog!
        `z-[100000] rounded-md border border-gray-100 bg-white px-2 py-1 text-xs text-gray-800 shadow-md ` +
        className
      }
      {...props}
    />
  </TooltipPrimitive.Portal>
);
