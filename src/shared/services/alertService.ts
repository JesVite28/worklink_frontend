import Swal from "sweetalert2";

function bringAlertToFront(): void {
  const container =
    Swal.getContainer();

  if (container) {
    container.style.zIndex =
      "99999";
  }
}

const baseOptions = {
  confirmButtonColor: "#7C3AED",
  cancelButtonColor: "#64748B",
  didOpen: bringAlertToFront,
};

export function showSuccess(
  message: string,
  title = "Éxito",
) {
  return Swal.fire({
    ...baseOptions,
    icon: "success",
    title,
    text: message,
  });
}

export function showError(
  message: string,
  title = "Error",
) {
  return Swal.fire({
    ...baseOptions,
    icon: "error",
    title,
    text: message,
  });
}

export function showWarning(
  message: string,
  title = "Advertencia",
) {
  return Swal.fire({
    ...baseOptions,
    icon: "warning",
    title,
    text: message,
  });
}

export function showInfo(
  message: string,
  title = "Información",
) {
  return Swal.fire({
    ...baseOptions,
    icon: "info",
    title,
    text: message,
  });
}

export function showConfirm({
  title,
  text,
  confirmButtonText = "Confirmar",
  cancelButtonText = "Cancelar",
}: {
  title: string;
  text: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}) {
  return Swal.fire({
    ...baseOptions,
    icon: "question",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });
}

export function showDelete(
  title: string,
  text: string,
  confirmButtonText = "Eliminar",
) {
  return Swal.fire({
    ...baseOptions,
    icon: "warning",
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText:
      "Cancelar",
    confirmButtonColor:
      "#EF4444",
    reverseButtons: true,
  });
}