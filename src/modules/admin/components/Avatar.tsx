type Props = {
  name: string;
  image?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export default function Avatar({ name, image, size = "md" }: Props) {
  if (image) {
    return <img src={image} alt={name} className={`rounded-full object-cover ${sizeClasses[size]}`} />;
  }

  return (
    <div className={`rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center ${sizeClasses[size]}`}>
      {name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()}
    </div>
  );
}