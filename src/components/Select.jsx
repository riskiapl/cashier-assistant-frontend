import { Select, createOptions } from "@thisbeyond/solid-select";
import "@thisbeyond/solid-select/style.css";
import "@styles/select.css";

const SolidSelect = (props) => {
  // Default styling - can be overridden via props
  const defaultProps = {
    containerClass: "w-full",
    class:
      "mt-1 block w-full text-base sm:text-sm rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500",
    optionClass: "py-2 px-3 hover:bg-indigo-50 cursor-pointer",
    clearable: false,
  };

  // Merge default props with passed props but use processed options
  const selectProps = {
    ...defaultProps,
    ...props,
  };

  return (
    <div class={props.wrapperClass || ""}>
      {props.label && (
        <label
          for={props.id || "select"}
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          {props.label}
        </label>
      )}
      <Select {...selectProps} />
    </div>
  );
};

export default SolidSelect;

export const getProps = (options) => {
  const props = createOptions(options, {
    key: "label",
  });

  return props;
};
