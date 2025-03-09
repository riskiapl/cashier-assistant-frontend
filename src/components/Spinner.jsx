const Spinner = ({ color = "white" }) => (
  <div
    class={`w-4 h-4 border-2 border-${color} rounded-full border-t-transparent animate-spin`}
  ></div>
);

export default Spinner;
