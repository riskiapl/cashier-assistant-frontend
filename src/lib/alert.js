import Swal from "sweetalert2";

const createToast = (color) =>
  Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.querySelector(".swal2-timer-progress-bar").style.backgroundColor =
        color;
    },
  });

export const alert = {
  success: (message) => {
    createToast("#28a745").fire({
      icon: "success",
      title: message,
    });
  },
  error: (message) => {
    createToast("#dc3545").fire({
      icon: "error",
      title: message,
    });
  },
  warning: (message) => {
    createToast("#ffc107").fire({
      icon: "warning",
      title: message,
    });
  },
  info: (message) => {
    createToast("#17a2b8").fire({
      icon: "info",
      title: message,
    });
  },
  confirm: async (options = {}) => {
    const result = await Swal.fire({
      title: options.title || "Are you sure?",
      text: options.text || "You won't be able to revert this!",
      icon: options.icon || "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: options.confirmText || "Yes",
      cancelButtonText: options.cancelText || "Cancel",
    });
    return result.isConfirmed;
  },
};
