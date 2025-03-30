const Card = ({ children, class: customClass }) => {
  return (
    <div
      class={`rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 flex flex-col ${
        customClass || ""
      }`}
    >
      {children}
    </div>
  );
};

export default Card;
