import { splitProps } from "solid-js";

export default function FormField(props) {
  // Split props for field vs input elements
  const [fieldProps, inputProps] = splitProps(props, [
    "value",
    "error",
    "label",
    "hint",
    "containerClass",
    "inputClass",
  ]);

  return (
    <div class={fieldProps.containerClass || ""}>
      <div class="flex items-center justify-between">
        <label class="block text-sm font-medium text-gray-700">
          {fieldProps.label}
        </label>
        {/* Error message moved to the right side of the title */}
        {fieldProps.error && (
          <p class="text-xs text-red-600">{fieldProps.error}</p>
        )}
      </div>

      <div>
        <input
          {...inputProps}
          class={`mt-1 block w-full px-4 py-3 rounded-xl border ${
            fieldProps.error ? "border-red-500" : "border-gray-300"
          } shadow-sm focus:border-blue-500 focus:outline-none transition-colors ${
            fieldProps.inputClass || ""
          }`}
          value={fieldProps.value || ""}
        />
      </div>

      {fieldProps.hint && (
        <p class="mt-1 text-xs text-gray-500">{fieldProps.hint}</p>
      )}
    </div>
  );
}
