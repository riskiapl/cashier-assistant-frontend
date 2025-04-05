import { createSignal, onMount } from "solid-js";
import { useTransContext } from "@mbarzda/solid-i18next";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiUpload,
  FiLock,
  FiTrash2,
  FiX,
} from "solid-icons/fi";
import Header from "@components/Header";
import Card from "@components/Card";
import Form from "@components/Form";
import Swal from "sweetalert2";
import { memberService } from "@services/memberService";
import { auth, useAuth, setAuth } from "@stores/authStore";
import { alert } from "@lib/alert";
import { useNavigate } from "@solidjs/router";
import ImageUploadDialog from "@zentered/solid-image-crop";
import imageCompression from "browser-image-compression";
import { useDarkMode } from "@context/DarkModeContext";

const Profile = () => {
  const [t] = useTransContext();
  const [userData, setUserData] = createSignal(null);
  const [loading, setLoading] = createSignal(false);
  const [passwordLoading, setPasswordLoading] = createSignal(false);
  const [deleteLoading, setDeleteLoading] = createSignal(false);
  const [showCropModal, setShowCropModal] = createSignal(false);
  const [avatarLoading, setAvatarLoading] = createSignal(false);
  const [showImagePreview, setShowImagePreview] = createSignal(false);
  const navigate = useNavigate();
  const { isDarkMode } = useDarkMode();

  onMount(async () => {
    setUserData(auth.user);
  });

  const handleUpdate = async (data) => {
    if (data.currentPassword) {
      setPasswordLoading(true);
    } else {
      setLoading(true);
    }
    try {
      const response = await memberService.updateMember(auth.user.id, data);
      setUserData(response.data);
      alert.success(response.message || "Profile updated successfully");
    } finally {
      if (data.currentPassword) {
        setPasswordLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Profile form config
  const profileFormConfig = () => ({
    initialData: {
      name: userData()?.name || "",
      email: userData()?.email || "",
      phoneNumber: userData()?.phoneNumber || "",
      address: userData()?.address || "",
    },
    fields: [
      {
        name: "name",
        label: t("profile.fullName"),
        icon: <FiUser />,
        placeholder: t("profile.fullNamePlaceholder"),
        required: true,
      },
      {
        name: "email",
        label: t("profile.email"),
        type: "email",
        icon: <FiMail />,
        placeholder: t("profile.emailPlaceholder"),
        required: true,
      },
      {
        name: "phoneNumber",
        label: t("profile.phone"),
        icon: <FiPhone />,
        placeholder: t("profile.phonePlaceholder"),
      },
      {
        name: "address",
        label: t("profile.address"),
        textarea: true,
        rows: 3,
        placeholder: t("profile.addressPlaceholder"),
      },
    ],
    validate: (data) => {
      const errors = {};

      if (!data.name?.trim()) {
        errors.name = t("profile.name_required");
      } else if (data.name.trim().length > 25) {
        errors.name = t("profile.name_exceeds");
      }

      if (!data.email?.trim()) {
        errors.email = t("profile.email_required");
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = t("profile.email_invalid");
      }

      return errors;
    },
    onSubmit: handleUpdate,
    loading: loading(),
    submitText: t("profile.updateProfile"),
    loadingText: t("profile.updating"),
  });

  // Password form config
  const passwordFormConfig = () => ({
    initialData: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    fields: [
      {
        name: "currentPassword",
        label: t("profile.security.currentPassword"),
        type: "password",
        icon: <FiLock />,
        placeholder: t("profile.security.currentPasswordPlaceholder"),
        required: true,
      },
      {
        name: "newPassword",
        label: t("profile.security.newPassword"),
        type: "password",
        icon: <FiLock />,
        placeholder: t("profile.security.newPasswordPlaceholder"),
        required: true,
      },
      {
        name: "confirmPassword",
        label: t("profile.security.confirmPassword"),
        type: "password",
        icon: <FiLock />,
        placeholder: t("profile.security.confirmPasswordPlaceholder"),
        required: true,
      },
    ],
    validate: (data) => {
      const errors = {};

      if (!data.currentPassword) {
        errors.currentPassword = "Current password is required";
      }

      if (!data.newPassword) {
        errors.newPassword = "New password is required";
      } else if (data.newPassword.length < 8) {
        errors.newPassword = "Password must be at least 8 characters";
      }

      if (!data.confirmPassword) {
        errors.confirmPassword = "Please confirm your password";
      } else if (data.newPassword !== data.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }

      return errors;
    },
    onSubmit: handleUpdate,
    loading: passwordLoading(),
    submitText: t("profile.security.changePassword"),
    loadingText: t("profile.security.changingPassword"),
  });

  const handleAvatarChange = () => {
    setShowCropModal(true);
  };

  const closeModal = () => {
    setShowCropModal(false);
  };

  const handleAvatarClick = () => {
    if (userData().avatar) {
      setShowImagePreview(true);
    }
  };

  async function saveImage(croppedImage) {
    setAvatarLoading(true);
    try {
      // Convert base64 to blob
      const base64Response = await fetch(croppedImage.croppedImage);
      const blob = await base64Response.blob();

      // Compress the image
      const compressedFile = await imageCompression(blob, {
        maxSizeMB: 1, // Max file size in MB
        maxWidthOrHeight: 400, // Max width/height
        useWebWorker: true,
      });

      // Convert compressed blob to file with proper name
      const compressedImageFile = new File(
        [compressedFile],
        `${auth.user.id}_avatar.jpg`,
        { type: "image/jpeg" }
      );

      // Create FormData to send to the backend
      const formData = new FormData();
      formData.append("avatar", compressedImageFile);

      // Upload to server
      const response = await memberService.updateAvatar(auth.user.id, formData);

      // Update local user data
      setUserData(response.data);
      setAuth("user", response.data);
      localStorage.setItem("user", JSON.stringify(response.data));
      alert.success(response.message || "Avatar updated successfully");
    } finally {
      setAvatarLoading(false);
      closeModal();
    }
  }

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
        const response = await memberService.deleteMember(auth.user.id);
        alert.success(response.message || "Account deleted successfully");
        useAuth().logout();
        navigate("/auth/login", { replace: true });
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  return (
    <div>
      <Header title={() => t("profile.title")} />
      {userData() ? (
        <div class="p-3 flex flex-col gap-3">
          <Card class="p-3 bg-gray-50 dark:bg-gray-800">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="flex flex-col items-center p-5">
                <div class="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 mb-5 flex items-center justify-center">
                  {userData().avatar ? (
                    <img
                      src={userData().avatar}
                      alt="Profile"
                      class="w-full h-full object-cover cursor-pointer"
                      onClick={handleAvatarClick}
                    />
                  ) : (
                    <FiUser class="text-gray-400 text-4xl" />
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleAvatarChange}
                  class="cursor-pointer flex items-center gap-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-3 py-2"
                >
                  <FiUpload />
                  <span class="dark:text-gray-200">
                    {t("profile.changePhoto")}
                  </span>
                </button>

                <div class="mt-7 text-center">
                  <h3 class="text-lg font-medium dark:text-gray-200">
                    {userData().name || userData().username}
                  </h3>
                  <p class="text-gray-500 dark:text-gray-400">
                    {userData().email}
                  </p>
                </div>
              </div>

              <div class="md:col-span-2">
                <Form {...profileFormConfig()} />
              </div>
            </div>
          </Card>

          <Card class="p-3 bg-gray-50 dark:bg-gray-800">
            <h2 class="text-xl font-semibold mb-4 dark:text-gray-200">
              {t("profile.security.title")}
            </h2>
            <Form {...passwordFormConfig()} />

            <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium text-red-600 mb-3">
                {t("profile.dangerZone.title")}
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
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
          <Card class="p-3 bg-gray-50 dark:bg-gray-800">
            <div class="animate-pulse">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Avatar section skeleton */}
                <div class="flex flex-col items-center p-5">
                  <div class="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-700 mb-5"></div>
                  <div class="w-32 h-8 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
                  <div class="mt-7 text-center">
                    <div class="w-24 h-5 bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>
                    <div class="w-40 h-4 bg-gray-300 dark:bg-gray-700 rounded mx-auto mt-2"></div>
                  </div>
                </div>

                {/* Form skeleton */}
                <div class="md:col-span-2">
                  <div class="space-y-4">
                    <div class="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div class="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div class="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div class="h-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
                    <div class="w-32 h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card class="p-3 bg-gray-50 dark:bg-gray-800">
            <div class="animate-pulse">
              <div class="h-6 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
              <div class="space-y-4">
                <div class="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div class="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div class="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div class="w-32 h-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Image Upload Dialog */}
      <ImageUploadDialog
        title={t("profile.changePhoto")}
        isOpen={showCropModal}
        closeModal={closeModal}
        openModal={() => setShowCropModal(true)}
        saveImage={saveImage}
        loading={avatarLoading()}
        defaultRatio="1:1"
        hideRatioSelect={true}
      />

      {/* Image Preview Modal */}
      {showImagePreview() && (
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 dark:bg-black dark:bg-opacity-90"
          onClick={() => setShowImagePreview(false)}
        >
          <div class="relative max-w-4xl max-h-[90vh] overflow-hidden">
            <button
              class="absolute top-3 right-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full p-1"
              onClick={(e) => {
                e.stopPropagation();
                setShowImagePreview(false);
              }}
            >
              <FiX size={5} />
            </button>
            <img
              src={userData().avatar}
              alt="Profile Preview"
              class="max-h-[85vh] max-w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
