import { splitProps, createEffect, onMount } from "solid-js";
import { useDarkMode } from "@context/DarkModeContext";

export default function FormField(props) {
  // Split props for field vs input elements
  const [fieldProps, inputProps] = splitProps(props, [
    "value",
    "error",
    "label",
    "containerClass",
    "inputClass",
  ]);

  const { isDarkMode } = useDarkMode();
  let inputRef;

  // Add CSS styling for autofill based on dark mode
  onMount(() => {
    if (inputRef) {
      // Apply a style element to handle autofill styling
      const styleEl = document.createElement("style");
      styleEl.textContent = `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px ${
            isDarkMode() ? "#374151" : "white"
          } inset !important;
          -webkit-text-fill-color: ${
            isDarkMode() ? "white" : "black"
          } !important;
          font-size: inherit !important;
        }
        
        /* Fix for hover suggestion text size */
        input::-webkit-list-button-appearance,
        input::-webkit-contacts-auto-fill-button,
        input::-webkit-credentials-auto-fill-button {
          visibility: hidden;
        }
        
        /* Fix text size in autocomplete dropdown */
        input:-webkit-autofill-selected {
          font-size: inherit !important;
        }

        /* Fix for Chrome and other webkit browsers */
        @media screen and (-webkit-min-device-pixel-ratio:0) {
          select,
          input {
            font-size: 16px !important;
          }
        }
      `;
      document.head.appendChild(styleEl);

      return () => {
        document.head.removeChild(styleEl);
      };
    }
  });

  // Update autofill styling when dark mode changes
  createEffect(() => {
    const dark = isDarkMode();
    const styles = document.querySelectorAll("style");
    const autofillStyle = Array.from(styles).find((style) =>
      style.textContent.includes("input:-webkit-autofill")
    );

    if (autofillStyle) {
      autofillStyle.textContent = `
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus, 
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px ${
            dark ? "#374151" : "white"
          } inset !important;
          -webkit-text-fill-color: ${dark ? "white" : "black"} !important;
          font-size: inherit !important;
        }
        
        /* Fix for hover suggestion text size */
        input::-webkit-list-button-appearance,
        input::-webkit-contacts-auto-fill-button,
        input::-webkit-credentials-auto-fill-button {
          visibility: hidden;
        }
        
        /* Fix text size in autocomplete dropdown */
        input:-webkit-autofill-selected {
          font-size: inherit !important;
        }

        /* Fix for Chrome and other webkit browsers */
        @media screen and (-webkit-min-device-pixel-ratio:0) {
          select,
          input {
            font-size: 16px !important;
          }
        }
      `;
    }
  });

  return (
    <div class={fieldProps.containerClass || ""}>
      <div class="flex items-center justify-between">
        <label
          class={`block text-sm font-medium ${
            isDarkMode() ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {fieldProps.label}
        </label>
        {fieldProps.error && (
          <p class="text-xs text-red-600">{fieldProps.error}</p>
        )}
      </div>

      <div>
        <input
          {...inputProps}
          ref={inputRef}
          style={{ "font-size": "16px" }}
          class={`mt-1 block w-full px-4 py-3 rounded-xl ${
            fieldProps.error
              ? "border-red-500"
              : isDarkMode()
              ? "border-gray-600"
              : "border-gray-300"
          } shadow-sm focus:border-blue-500 focus:outline-none transition-colors ${
            isDarkMode() ? "bg-gray-700 text-white" : ""
          } ${fieldProps.inputClass || ""}`}
          value={fieldProps.value || ""}
        />
      </div>
    </div>
  );
}
