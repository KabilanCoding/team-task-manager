export function DataTable({ columns, rows, emptyText = "No records yet" }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50/80">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.length ? rows.map((row) => (
            <tr key={row.id} className="transition hover:bg-blue-50/40">
              {columns.map((column) => (
                <td key={column.key} className="px-5 py-4 text-sm text-slate-700">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          )) : (
            <tr>
              <td className="px-5 py-8 text-center text-sm text-slate-500" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
