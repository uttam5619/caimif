import React from "react";
import { GET_IN_TOUCH_HEADING, GET_IN_TOUCH_ITEMS } from "./contact.config";

/**
 * GetInTouchInfo Component
 *
 * Displays CAIMIF institutional address, email, and phone details
 * on the left column of the Contact Us card.
 */
export default function GetInTouchInfo() {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        {GET_IN_TOUCH_HEADING}
      </h2>

      <div className="mt-6 space-y-6">
        {GET_IN_TOUCH_ITEMS.map((item) => (
          <div key={item.label}>
            <h3 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              {item.label}
            </h3>
            {item.href ? (
              <a
                href={item.href}
                className="mt-1.5 inline-block text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                {item.value}
              </a>
            ) : (
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {item.value}
              </p>
            )}
          </div>
        ))}
      </div>

      <hr className="mt-6 border-zinc-200/80 dark:border-zinc-800" />
    </div>
  );
}
