type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function SectionTitle({ title, description, action }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h2 className="text-xl font-semibold text-text">{title}</h2>
        {description ? <p className="text-sm text-text-muted mt-1">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}