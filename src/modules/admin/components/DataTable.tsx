type ColumnDef<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
};

type Props<T> = {
  title: string;
  subtitle?: string;
  columns: ColumnDef<T>[];
  rows: T[];
};

export default function DataTable<T>({ title, subtitle, columns, rows }: Props<T>) {
  return (
    <section className="card-soft p-5 overflow-hidden">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-text">{title}</h3>
        {subtitle ? <p className="text-sm text-text-muted mt-1">{subtitle}</p> : null}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-text-muted">
              {columns.map((column) => (
                <th key={column.key} className="pb-3 font-medium">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border/60 last:border-b-0">
                {columns.map((column) => (
                  <td key={column.key} className="py-4 pr-4 align-middle text-text">
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}