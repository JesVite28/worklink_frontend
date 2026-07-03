import { type ChangeEvent, useRef } from "react";
import {
  CameraIcon,
  PhotoIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import { showWarning } from "../../../shared/services/alertService";

type Props = {
  image: string | null;
  setImage: (image: string | null) => void;
  setProfilePhotoFile: (file: File | null) => void;
};

const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const maxFileSizeInMB = 2;
const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024;

export default function ProfileImagePicker({
  image,
  setImage,
  setProfilePhotoFile,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!allowedImageTypes.includes(file.type)) {
      await showWarning("La imagen debe ser JPG, PNG o WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > maxFileSizeInBytes) {
      await showWarning(`La imagen no debe superar los ${maxFileSizeInMB} MB.`);
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage(String(reader.result));
      setProfilePhotoFile(file);
    };

    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const removeImage = () => {
    setImage(null);
    setProfilePhotoFile(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-28 w-28 overflow-visible">
        <button
          type="button"
          onClick={openFilePicker}
          className="group relative h-28 w-28 overflow-hidden rounded-full border-2 border-border bg-surface shadow-lg transition hover:border-primary"
          aria-label="Seleccionar foto de perfil"
        >
          {image ? (
            <img
              src={image}
              alt="Foto de perfil"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center text-text-muted">
              <PhotoIcon className="mb-1 h-8 w-8" />
              <span className="text-xs">Foto</span>
            </div>
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
              Cambiar
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={openFilePicker}
          className="absolute bottom-0 right-0 z-20 flex h-9 w-9 items-center justify-center rounded-full border-4 border-background bg-primary text-white shadow-lg transition hover:scale-105 hover:opacity-90"
          aria-label="Cambiar foto"
        >
          <CameraIcon className="h-4 w-4" />
        </button>

        {image && (
          <button
            type="button"
            onClick={removeImage}
            className="absolute -right-1 -top-1 z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-red-500 text-white shadow-lg transition hover:scale-105"
            aria-label="Eliminar foto"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        onChange={handleSelectImage}
      />
    </div>
  );
}