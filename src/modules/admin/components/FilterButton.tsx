type Props = {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export default function FilterButton({ children, active = false, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-2 rounded-lg border text-sm transition ${
        active
          ? "bg-primary text-white border-primary"
          : "bg-surface text-text border-border hover:border-primary"
      }`}
    >
      {children}
    </button>
  );
}