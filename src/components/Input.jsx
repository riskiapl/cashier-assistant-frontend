import { splitProps } from "solid-js";

const Input = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "type",
    "label",
    "icon",
    "textarea",
    "rows",
    "error",
    "value",
    "onInput",
    "onChange",
    "required",
  ]);

  return (
    <div class="space-y-2">
      {local.label && (
        <label class="block text-sm font-medium text-gray-700">
          {local.label}
          {local.required && <span class="text-red-500 ml-1">*</span>}
        </label>
      )}

      {local.textarea ? (
        <textarea
          value={local.value || ""}
          rows={local.rows || 3}
          class={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none bg-transparent ${
            local.class || ""
          } ${local.error ? "border-red-500" : ""}`}
          onInput={local.onInput}
          onChange={local.onChange}
          required={local.required}
          {...others}
        />
      ) : (
        <div
          class={`flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${
            local.error ? "border-red-500" : ""
          }`}
        >
          {local.icon && <div class="text-gray-400 mr-2">{local.icon}</div>}
          <input
            type={local.type || "text"}
            value={local.value || ""}
            class={`flex-1 border-none focus:outline-none bg-transparent ${
              local.class || ""
            }`}
            onInput={local.onInput}
            onChange={local.onChange}
            required={local.required}
            {...others}
          />
        </div>
      )}

      {local.error && <p class="text-sm text-red-500">{local.error}</p>}
    </div>
  );
};

export default Input;
