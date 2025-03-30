import { createSignal, onMount } from "solid-js";
import { FiUser, FiMail, FiPhone, FiUpload, FiLock } from "solid-icons/fi";
import Header from "@components/Header";
import Card from "@components/Card";
import Input from "@components/Input";

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
    <div>
      <Header title="Profile Settings" />

      <div class="p-3 flex flex-col gap-3">
        <Card class="p-3 bg-gray-50">
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
                <Input
                  name="name"
                  label="Full Name"
                  icon={<FiUser />}
                  value={userData().name}
                  placeholder="Full Name"
                  required
                />

                <Input
                  name="email"
                  type="email"
                  label="Email Address"
                  icon={<FiMail />}
                  value={userData().email}
                  placeholder="Email Address"
                  required
                />

                <Input
                  name="phone"
                  label="Phone Number"
                  icon={<FiPhone />}
                  value={userData().phone}
                  placeholder="Phone Number"
                  required
                />

                <Input
                  name="address"
                  label="Address"
                  textarea
                  rows={3}
                  value={userData().address}
                  placeholder="Your address"
                />

                <button
                  type="submit"
                  class="bg-primary-500 hover:bg-primary-400 text-white py-2 px-4 rounded-md flex items-center justify-center"
                  disabled={loading()}
                >
                  {loading() ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </div>
          </div>
        </Card>

        <Card class="p-3 bg-gray-50">
          <h2 class="text-xl font-semibold mb-4">Security Settings</h2>
          <form class="space-y-4">
            <Input
              type="password"
              name="currentPassword"
              label="Current Password"
              icon={<FiLock />}
              placeholder="Enter current password"
            />

            <Input
              type="password"
              name="newPassword"
              label="New Password"
              icon={<FiLock />}
              placeholder="Enter new password"
            />

            <Input
              type="password"
              name="confirmPassword"
              label="Confirm New Password"
              icon={<FiLock />}
              placeholder="Confirm new password"
            />

            <button
              type="button"
              class="bg-primary-500 hover:bg-primary-400 text-white py-2 px-4 rounded-md"
            >
              Change Password
            </button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
