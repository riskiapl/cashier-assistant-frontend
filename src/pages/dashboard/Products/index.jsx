import { createSignal, For } from "solid-js";
import { createStore } from "solid-js/store";
import ProductModal from "./ModalInput";

const Products = () => {
  // State for products data
  const [products, setProducts] = createStore([
    {
      id: 1,
      name: "Pizza",
      price: 10000,
      stock: 20,
      image: "https://picsum.photos/600/400",
    },
    {
      id: 2,
      name: "spaghetti",
      price: 25000,
      stock: 15,
      image: "https://picsum.photos/600/400",
    },
    {
      id: 3,
      name: "Lasagna",
      price: 5000,
      stock: 30,
      image: "https://picsum.photos/600/400",
    },
    {
      id: 4,
      name: "Hamburger",
      price: 15000,
      stock: 10,
      image: "https://picsum.photos/600/400",
    },
  ]);

  // State for modal
  const [isModalOpen, setIsModalOpen] = createSignal(false);
  const [currentProduct, setCurrentProduct] = createSignal(null);
  const [searchQuery, setSearchQuery] = createSignal("");

  // Filtered products based on search
  const filteredProducts = () => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery().toLowerCase())
    );
  };

  // Function to open add modal
  const handleAddProduct = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  // Function to open edit modal
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  // Function to save product (add or update)
  const handleSaveProduct = (productData) => {
    if (currentProduct()) {
      // Edit existing product
      setProducts(
        products.map((p) =>
          p.id === currentProduct().id ? { ...p, ...productData } : p
        )
      );
    } else {
      // Add new product
      const newId = Math.max(...products.map((p) => p.id), 0) + 1;
      setProducts([...products, { id: newId, ...productData }]);
    }
    setIsModalOpen(false);
  };

  // Function to delete product
  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div class="p-3 sticky top-0 bg-white z-10 md:flex items-center md:justify-between space-y-4 md:space-y-0 border-b">
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 md:ml-4 text-align-center">
          Products
        </h1>
        <div class="flex w-full sm:w-auto gap-3 items-stretch sm:items-center">
          <input
            type="text"
            placeholder="Search products..."
            onInput={(e) => setSearchQuery(e.target.value)}
            value={searchQuery()}
            class="px-3 py-2 border border-gray-300 rounded-md w-full sm:min-w-[250px] focus:outline-none focus:shadow-md focus:shadow-primary-100 transition-shadow"
          />
          <button
            class="bg-primary-500 text-white px-4 py-2.5 rounded-md cursor-pointer hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
            onClick={handleAddProduct}
          >
            <span class="i-carbon-add text-lg"></span>
            <span class="whitespace-nowrap">Add Product</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 p-3">
        <For each={filteredProducts()}>
          {(product) => (
            <div class="border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 bg-white flex flex-col">
              <div class="h-[150px] sm:h-[200px] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div class="p-3 sm:p-4 flex-grow flex flex-col">
                <h3 class="font-bold text-base sm:text-lg text-primary-600 mb-2">
                  {product.name}
                </h3>
                <div class="flex justify-between mb-2 sm:mb-3">
                  <p class="font-bold text-red-600 text-sm sm:text-base">
                    Rp {product.price.toLocaleString()}
                  </p>
                  <p class="text-gray-600 text-sm sm:text-base">
                    Stock: {product.stock}
                  </p>
                </div>
                <div class="flex justify-between mt-auto gap-2">
                  <button
                    class="bg-primary-500 text-white px-2 sm:px-3 py-1.5 rounded-md cursor-pointer hover:bg-primary-600 transition-colors flex-grow flex items-center justify-center gap-1"
                    onClick={() => handleEditProduct(product)}
                  >
                    <span class="i-carbon-edit text-sm"></span>
                    <span class="text-sm sm:text-base">Edit</span>
                  </button>
                  <button
                    class="bg-red-500 text-white px-2 sm:px-3 py-1.5 rounded-md cursor-pointer hover:bg-red-600 transition-colors flex-grow flex items-center justify-center gap-1"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <span class="i-carbon-trash-can text-sm"></span>
                    <span class="text-sm sm:text-base">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </For>
      </div>

      {isModalOpen() && (
        <ProductModal
          product={currentProduct()}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
};

export default Products;
