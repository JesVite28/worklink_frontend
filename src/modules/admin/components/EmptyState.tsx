type Props = {
  title: string;
  description: string;
};

export default function EmptyState({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="mt-2 text-sm text-text-muted max-w-md">{description}</p>
    </div>
  );
}