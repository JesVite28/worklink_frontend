import {
  type ChangeEvent,
  useRef,
} from "react";

import {
  CameraIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

import {
  showWarning,
} from "../../../shared/services/alertService";

type Props = {
  image: string | null;
  initials?: string;

  setImage: (
    image: string | null,
  ) => void;

  setProfilePhotoFile: (
    file: File | null,
  ) => void;
};

const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const maxFileSizeInMB = 2;

const maxFileSizeInBytes =
  maxFileSizeInMB *
  1024 *
  1024;

export default function ProfileImagePicker({
  image,
  initials,
  setImage,
  setProfilePhotoFile,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement | null>(
      null,
    );

  const handleSelectImage =
    async (
      event: ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      if (
        !allowedImageTypes.includes(
          file.type,
        )
      ) {
        await showWarning(
          "La imagen debe ser JPG, PNG o WEBP.",
        );

        event.target.value = "";

        return;
      }

      if (
        file.size >
        maxFileSizeInBytes
      ) {
        await showWarning(
          `La imagen no debe superar los ${maxFileSizeInMB} MB.`,
        );

        event.target.value = "";

        return;
      }

      const reader =
        new FileReader();

      reader.onload = () => {
        setImage(
          String(reader.result),
        );

        setProfilePhotoFile(
          file,
        );
      };

      reader.readAsDataURL(
        file,
      );
    };

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const removeImage = () => {
    setImage(null);
    setProfilePhotoFile(null);

    if (inputRef.current) {
      inputRef.current.value =
        "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-32 w-32 overflow-visible">
        <button
          type="button"
          onClick={openFilePicker}
          className="group relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-primary/10 bg-primary/10 text-primary shadow-lg transition hover:border-primary/30"
          aria-label="Seleccionar foto de perfil"
        >
          {image ? (
            <img
              src={image}
              alt="Foto de perfil"
              className="h-full w-full object-cover"
            />
          ) : initials ? (
            <span className="text-3xl font-bold uppercase">
              {initials}
            </span>
          ) : (
            <UserCircleIcon className="h-20 w-20" />
          )}

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
              Seleccionar
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={openFilePicker}
          className="absolute bottom-0 right-0 z-20 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-primary text-white shadow-lg transition hover:scale-105 hover:opacity-90"
          aria-label="Cambiar foto"
        >
          <CameraIcon className="h-4 w-4" />
        </button>

        {image && (
          <button
            type="button"
            onClick={removeImage}
            className="absolute -right-1 -top-1 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-danger text-white shadow-lg transition hover:scale-105"
            aria-label="Eliminar foto"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-text">
          Foto opcional
        </p>

        <p className="mt-1 text-xs text-text-muted">
          JPG, PNG o WEBP. Máximo 2 MB.
        </p>
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