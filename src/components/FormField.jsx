export default function FormField(props) {
  return (
    <div class={props.containerClass || ""}>
      <div class="flex items-center justify-between">
        <label class="block text-sm font-medium text-gray-700">
          {props.label}
        </label>
        {props.error && <p class="text-xs text-red-600">{props.error}</p>}
      </div>
      <input
        type={props.type || "text"}
        name={props.name}
        value={props.value}
        onBlur={props.onBlur}
        onInput={props.onInput}
        class={`mt-1 block w-full px-4 py-3 rounded-xl border ${
          props.error ? "border-red-500" : "border-gray-300"
        } shadow-sm focus:border-blue-500 focus:outline-none transition-colors ${
          props.inputClass || ""
        }`}
        placeholder={props.placeholder}
        required={props.required}
        disabled={props.disabled}
        autocomplete={props.autocomplete}
      />
      {props.hint && <p class="mt-1 text-xs text-gray-500">{props.hint}</p>}
    </div>
  );
}
