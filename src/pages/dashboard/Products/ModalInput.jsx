import { createStore } from "solid-js/store";

// Product Modal Component
const ProductModal = (props) => {
  const isEdit = () => props.product !== null;
  const [formData, setFormData] = createStore({
    name: props.product?.name || "",
    price: props.product?.price || 0,
    stock: props.product?.stock || 0,
    image: props.product?.image || "https://picsum.photos/600/400",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSave(formData);
  };

  const handleChange = (field, value) => {
    setFormData({
      [field]: field === "price" || field === "stock" ? Number(value) : value,
    });
  };

  return (
    <div class="fixed inset-0 bg-black/60 flex justify-center items-center z-[1000] backdrop-blur-sm">
      <div class="bg-white p-6 rounded-xl min-w-[400px] max-w-[90%] shadow-xl">
        <div class="flex justify-between items-center mb-5">
          <h2 class="text-xl font-bold text-primary-500">
            {isEdit() ? "Edit Product" : "Add New Product"}
          </h2>
          <button
            onClick={props.onClose}
            class="text-gray-500 hover:text-gray-700"
          >
            <span class="i-carbon-close text-xl"></span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div class="mb-4">
            <label for="name" class="block mb-1 font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onInput={(e) => handleChange("name", e.target.value)}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter product name"
            />
          </div>
          <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label for="price" class="block mb-1 font-medium text-gray-700">
                Price (Rp)
              </label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onInput={(e) => handleChange("price", e.target.value)}
                required
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0"
              />
            </div>
            <div>
              <label for="stock" class="block mb-1 font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                value={formData.stock}
                onInput={(e) => handleChange("stock", e.target.value)}
                required
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                placeholder="0"
              />
            </div>
          </div>
          <div class="mb-4">
            <label for="image" class="block mb-1 font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="text"
              id="image"
              value={formData.image}
              onInput={(e) => handleChange("image", e.target.value)}
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300 transition-colors"
              onClick={props.onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-primary-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-primary-600 transition-colors"
            >
              {isEdit() ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
