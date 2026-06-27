import { useRef } from "react";

interface Props {
  image: string | null;
  setImage: (img: string) => void;
}

export default function ProfileImagePicker({ image, setImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col items-center mb-6">

      {/* 🔵 círculo */}
      <div
        onClick={() => inputRef.current?.click()}
        className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 cursor-pointer relative overflow-hidden flex items-center justify-center border border-border"
      >
        {image ? (
          <img
            src={image}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-xs text-gray-500">
            Foto
          </span>
        )}

        {/* 📷 icono cámara */}
        <div className="absolute bottom-0 right-0 bg-black/60 text-white p-1 rounded-full text-xs">
          📷
        </div>
      </div>

      {/* input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleFile}
      />
    </div>
  );
}