import { createSignal, onMount } from "solid-js";
import { FiUser, FiMail, FiPhone, FiUpload, FiLock } from "solid-icons/fi";

const Profile = () => {
  const [userData, setUserData] = createSignal({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "081234567890",
    address: "Jl. Contoh No. 123",
    avatar: null,
  });
  const [loading, setLoading] = createSignal(false);

  onMount(async () => {
    // Fetch user data from API
    try {
      // const response = await axios.get('/api/user/profile');
      // setUserData(response.data);
    } catch (error) {
      console.error("Failed to load user data");
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = Object.fromEntries(formData.entries());

    setLoading(true);
    try {
      // Replace with actual API call
      // await axios.put('/api/user/profile', values);
      console.log("Updated profile data:", values);
      setUserData((prev) => ({ ...prev, ...values }));
      // Success notification would be here
    } catch (error) {
      // Error notification would be here
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserData((prev) => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold mb-6">Profile Settings</h1>

      <div class="bg-white rounded-md shadow mb-6 p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="flex flex-col items-center p-5">
            <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-100 mb-5 flex items-center justify-center">
              {userData().avatar ? (
                <img
                  src={userData().avatar}
                  alt="Profile"
                  class="w-full h-full object-cover"
                />
              ) : (
                <FiUser class="text-gray-400 text-4xl" />
              )}
            </div>

            <label class="cursor-pointer flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50">
              <FiUpload />
              <span>Change Photo</span>
              <input
                type="file"
                class="hidden"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </label>

            <div class="mt-7 text-center">
              <h3 class="text-lg font-medium">{userData().name}</h3>
              <p class="text-gray-500">{userData().email}</p>
            </div>
          </div>

          <div class="md:col-span-2">
            <form onSubmit={handleSubmit} class="space-y-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div class="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <FiUser class="text-gray-400 mr-2" />
                  <input
                    name="name"
                    type="text"
                    value={userData().name}
                    class="flex-1 border-none focus:outline-none"
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div class="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <FiMail class="text-gray-400 mr-2" />
                  <input
                    name="email"
                    type="email"
                    value={userData().email}
                    class="flex-1 border-none focus:outline-none"
                    placeholder="Email Address"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div class="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                  <FiPhone class="text-gray-400 mr-2" />
                  <input
                    name="phone"
                    type="text"
                    value={userData().phone}
                    class="flex-1 border-none focus:outline-none"
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  value={userData().address}
                  rows="3"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  placeholder="Your address"
                ></textarea>
              </div>

              <button
                type="submit"
                class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
                disabled={loading()}
              >
                {loading() ? "Updating..." : "Update Profile"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-md shadow mb-6 p-6">
        <h2 class="text-xl font-semibold mb-4">Security Settings</h2>
        <form class="space-y-4">
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div class="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <FiLock class="text-gray-400 mr-2" />
              <input
                type="password"
                class="flex-1 border-none focus:outline-none"
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div class="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <FiLock class="text-gray-400 mr-2" />
              <input
                type="password"
                class="flex-1 border-none focus:outline-none"
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div class="flex items-center border border-gray-300 rounded-md px-3 py-2 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <FiLock class="text-gray-400 mr-2" />
              <input
                type="password"
                class="flex-1 border-none focus:outline-none"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button
            type="button"
            class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
