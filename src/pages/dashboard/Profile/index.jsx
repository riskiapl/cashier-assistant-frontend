import { createEffect, createSignal, onMount } from "solid-js";
import { useTransContext } from "@mbarzda/solid-i18next";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiUpload,
  FiLock,
  FiTrash2,
} from "solid-icons/fi";
import Header from "@components/Header";
import Card from "@components/Card";
import Input from "@components/Input";
import Swal from "sweetalert2";
import { memberService } from "@services/memberService";
import { auth } from "@stores/authStore";
import { alert } from "@lib/alert";

const Profile = () => {
  const [t] = useTransContext();
  const [userData, setUserData] = createSignal(null);
  const [loading, setLoading] = createSignal(false);
  const [deleteLoading, setDeleteLoading] = createSignal(false);

  onMount(async () => {
    const response = await memberService.getMember(auth.user.id);
    setUserData(response.data);
  });

  createEffect(() => {
    console.log(userData(), "userData");
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = {
      name: formData.get("name"),
      email: formData.get("email"),
      phoneNumber: formData.get("phoneNumber"),
      address: formData.get("address"),
    };
    console.log(values, auth.user.id, "masuk submit");

    setLoading(true);
    const response = await memberService.updateMember(auth.user.id, values);
    console.log(response, "masuk response");
    alert.success(response.message || "Update Success");
    setLoading(false);
  };

  const handleAvatarChange = (e) => {
    // const file = e.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     setUserData((prev) => ({ ...prev, avatar: e.target.result }));
    //   };
    //   reader.readAsDataURL(file);
    // }
  };

  const handleDeleteAccount = async () => {
    const result = await Swal.fire({
      title: t("profile.dangerZone.confirmDelete"),
      text: t("profile.dangerZone.confirmDeleteText"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("profile.dangerZone.confirmButtonText"),
      cancelButtonText: t("profile.dangerZone.cancelButtonText"),
    });

    if (result.isConfirmed) {
      setDeleteLoading(true);
      try {
        // Replace with actual API call
        // await axios.delete('/api/user/account');

        Swal.fire(
          t("profile.dangerZone.deletedTitle"),
          t("profile.dangerZone.deletedText"),
          "success"
        );
        console.log("Account deleted");
        // Redirect to logout or home page would be here
        // window.location.href = '/logout';
      } catch (error) {
        console.error("Failed to delete account", error);
        Swal.fire(
          t("profile.dangerZone.errorTitle"),
          t("profile.dangerZone.errorText"),
          "error"
        );
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  return (
    <div>
      <Header title={t("profile.title")} />
      {userData() ? (
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
                  <span>{t("profile.changePhoto")}</span>
                  <input
                    type="file"
                    class="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>

                <div class="mt-7 text-center">
                  <h3 class="text-lg font-medium">
                    {userData().name || userData().username}
                  </h3>
                  <p class="text-gray-500">{userData().email}</p>
                </div>
              </div>

              <div class="md:col-span-2">
                <form onSubmit={handleSubmit} class="space-y-4">
                  <Input
                    name="name"
                    label={t("profile.fullName")}
                    icon={<FiUser />}
                    value={userData().name}
                    placeholder={t("profile.fullNamePlaceholder")}
                    required
                  />

                  <Input
                    name="email"
                    type="email"
                    label={t("profile.email")}
                    icon={<FiMail />}
                    value={userData().email}
                    placeholder={t("profile.emailPlaceholder")}
                    required
                  />

                  <Input
                    name="phoneNumber"
                    label={t("profile.phone")}
                    icon={<FiPhone />}
                    value={userData().phoneNumber}
                    placeholder={t("profile.phonePlaceholder")}
                  />

                  <Input
                    name="address"
                    label={t("profile.address")}
                    textarea
                    rows={3}
                    value={userData().address}
                    placeholder={t("profile.addressPlaceholder")}
                  />

                  <button
                    type="submit"
                    class="bg-primary-500 hover:bg-primary-400 text-white py-2 px-4 rounded-md flex items-center justify-center"
                    disabled={loading()}
                  >
                    {loading()
                      ? t("profile.updating")
                      : t("profile.updateProfile")}
                  </button>
                </form>
              </div>
            </div>
          </Card>

          <Card class="p-3 bg-gray-50">
            <h2 class="text-xl font-semibold mb-4">
              {t("profile.security.title")}
            </h2>
            <form class="space-y-4">
              <Input
                type="password"
                name="currentPassword"
                label={t("profile.security.currentPassword")}
                icon={<FiLock />}
                placeholder={t("profile.security.currentPasswordPlaceholder")}
              />

              <Input
                type="password"
                name="newPassword"
                label={t("profile.security.newPassword")}
                icon={<FiLock />}
                placeholder={t("profile.security.newPasswordPlaceholder")}
              />

              <Input
                type="password"
                name="confirmPassword"
                label={t("profile.security.confirmPassword")}
                icon={<FiLock />}
                placeholder={t("profile.security.confirmPasswordPlaceholder")}
              />

              <button
                type="button"
                class="bg-primary-500 hover:bg-primary-400 text-white py-2 px-4 rounded-md"
              >
                {t("profile.security.changePassword")}
              </button>
            </form>

            <div class="mt-8 pt-6 border-t border-gray-200">
              <h3 class="text-lg font-medium text-red-600 mb-3">
                {t("profile.dangerZone.title")}
              </h3>
              <p class="text-gray-600 mb-4">
                {t("profile.dangerZone.warning")}
              </p>
              <button
                type="button"
                onClick={handleDeleteAccount}
                class="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                disabled={deleteLoading()}
              >
                <FiTrash2 />
                {deleteLoading()
                  ? t("profile.dangerZone.processing")
                  : t("profile.dangerZone.deleteAccount")}
              </button>
            </div>
          </Card>
        </div>
      ) : (
        <div class="p-3 flex flex-col gap-3">
          <Card class="p-3 bg-gray-50">
            <div class="animate-pulse">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Avatar section skeleton */}
                <div class="flex flex-col items-center p-5">
                  <div class="w-32 h-32 rounded-full bg-gray-300 mb-5"></div>
                  <div class="w-32 h-8 bg-gray-300 rounded-md"></div>
                  <div class="mt-7 text-center">
                    <div class="w-24 h-5 bg-gray-300 rounded mx-auto"></div>
                    <div class="w-40 h-4 bg-gray-300 rounded mx-auto mt-2"></div>
                  </div>
                </div>

                {/* Form skeleton */}
                <div class="md:col-span-2">
                  <div class="space-y-4">
                    <div class="h-12 bg-gray-300 rounded"></div>
                    <div class="h-12 bg-gray-300 rounded"></div>
                    <div class="h-12 bg-gray-300 rounded"></div>
                    <div class="h-24 bg-gray-300 rounded"></div>
                    <div class="w-32 h-10 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card class="p-3 bg-gray-50">
            <div class="animate-pulse">
              <div class="h-6 w-40 bg-gray-300 rounded mb-4"></div>
              <div class="space-y-4">
                <div class="h-12 bg-gray-300 rounded"></div>
                <div class="h-12 bg-gray-300 rounded"></div>
                <div class="h-12 bg-gray-300 rounded"></div>
                <div class="w-32 h-10 bg-gray-300 rounded"></div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
