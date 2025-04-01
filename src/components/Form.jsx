import { createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import Input from "./Input";

const Form = (props) => {
  const [formData, setFormData] = createStore(props.initialData || {});
  const [errors, setErrors] = createStore({});
  const [loading, setLoading] = createSignal(props.loading || false);

  // Update form data when initialData changes
  createEffect(() => {
    if (props.initialData) {
      setFormData(props.initialData);
    }
  });

  // Update loading state when props.loading changes
  createEffect(() => {
    setLoading(props.loading || false);
  });

  const handleInput = (field, value) => {
    setFormData(field, value);

    // Clear error when user types
    if (errors[field]) {
      setErrors(field, undefined);
    }

    if (props.onInput) {
      props.onInput(field, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation if provided
    if (props.validate) {
      const validationErrors = props.validate(formData);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }

    if (props.onSubmit) {
      setLoading(true);
      try {
        await props.onSubmit({ ...formData });
      } finally {
        if (!props.loading) {
          // Only set loading to false if it's not controlled externally
          setLoading(false);
        }
      }
    }
  };

  // Provide form data and errors to parent component
  if (props.onFormMount) {
    props.onFormMount({ formData, setFormData, errors, setErrors });
  }

  return (
    <form onSubmit={handleSubmit} class={props.class || "space-y-4"}>
      {props.fields?.map((field) => (
        <Input
          key={field.name}
          label={field.label}
          type={field.type || "text"}
          icon={field.icon}
          textarea={field.textarea}
          rows={field.rows}
          placeholder={field.placeholder}
          value={formData[field.name] || ""}
          onInput={(e) => handleInput(field.name, e.target.value)}
          error={errors[field.name]}
          required={field.required}
        />
      ))}

      {props.children}

      {props.submitButton !== false && (
        <button
          type="submit"
          class={
            props.submitButtonClass ||
            "bg-primary-500 hover:bg-primary-400 text-white py-2 px-4 rounded-md"
          }
          disabled={loading()}
        >
          {loading() ? props.loadingText : props.submitText}
        </button>
      )}
    </form>
  );
};

export default Form;
