import { Button } from '@/components/ui/Button';
import { Plus, Trash2 } from 'lucide-react';

interface TableData {
  headers: string[];
  rows: string[][];
}

interface TableEditorProps {
  value: TableData;
  onChange: (v: TableData) => void;
  disabled?: boolean;
}

export function TableEditor({ value = { headers: ['Column 1'], rows: [['']] }, onChange, disabled }: TableEditorProps) {
  const addColumn = () => {
    onChange({
      headers: [...value.headers, ''],
      rows: value.rows.map((r) => [...r, '']),
    });
  };

  const removeColumn = (colIdx: number) => {
    if (value.headers.length <= 1) return;
    onChange({
      headers: value.headers.filter((_, i) => i !== colIdx),
      rows: value.rows.map((r) => r.filter((_, i) => i !== colIdx)),
    });
  };

  const addRow = () => {
    onChange({ ...value, rows: [...value.rows, new Array(value.headers.length).fill('')] });
  };

  const removeRow = (rowIdx: number) => {
    onChange({ ...value, rows: value.rows.filter((_, i) => i !== rowIdx) });
  };

  const updateHeader = (colIdx: number, text: string) => {
    const headers = [...value.headers];
    headers[colIdx] = text;
    onChange({ ...value, headers });
  };

  const updateCell = (rowIdx: number, colIdx: number, text: string) => {
    const rows = value.rows.map((r) => [...r]);
    rows[rowIdx][colIdx] = text;
    onChange({ ...value, rows });
  };

  if (disabled) {
    return (
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              {value.headers.map((h, i) => (
                <th key={i} className="px-3 py-2 text-left font-semibold border-b">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {value.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-2 border-b">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full">
          <thead>
            <tr className="bg-blue-50">
              {value.headers.map((h, ci) => (
                <th key={ci} className="px-1 py-1 border-b border-r border-gray-200 last:border-r-0">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => updateHeader(ci, e.target.value)}
                      placeholder={`Header ${ci + 1}`}
                      className="w-full px-2 py-1.5 text-sm font-semibold bg-transparent focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-400 rounded"
                    />
                    {value.headers.length > 1 && (
                      <button type="button" onClick={() => removeColumn(ci)} className="text-red-400 hover:text-red-600 p-0.5 flex-shrink-0">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-10 border-b border-gray-200" />
            </tr>
          </thead>
          <tbody>
            {value.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-1 py-1 border-r border-gray-200 last:border-r-0">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      placeholder="..."
                      className="w-full px-2 py-1.5 text-sm bg-transparent focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-400 rounded"
                    />
                  </td>
                ))}
                <td className="w-10 text-center">
                  <button type="button" onClick={() => removeRow(ri)} className="text-red-400 hover:text-red-600 p-1">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Row
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={addColumn}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Add Column
        </Button>
      </div>
    </div>
  );
}
