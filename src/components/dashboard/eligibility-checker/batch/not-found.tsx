"use client";

interface NotFoundTableProps {
  accountNumbers: string[];
}

export default function NotFoundTable({ accountNumbers }: NotFoundTableProps) {
  if (accountNumbers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <p className="text-sm">No unmatched accounts</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
            <th className="px-4 py-3 font-medium w-12">#</th>
            <th className="px-4 py-3 font-medium">Account Number</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {accountNumbers.map((acct, idx) => (
            <tr
              key={acct}
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
              <td className="px-4 py-3 font-mono text-gray-700">{acct}</td>
              <td className="px-4 py-3">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
                  Not Found
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}