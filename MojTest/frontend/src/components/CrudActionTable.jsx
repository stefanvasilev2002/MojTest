const CrudActionTable = ({ headers, rows, onEdit, onDelete }) => (
    <div className="overflow-x-auto mt-4">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-100">
            <tr>
                {headers.map((header, index) => (
                    <th key={index} className="px-4 py-2 text-left border-b border-gray-200">
                        {header}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {rows.map((row, index) => (
                <tr key={index} className="border-b border-gray-200">
                    {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2">{cell}</td>
                    ))}
                    <td className="px-4 py-2">
                        <button onClick={() => onEdit(row[0])} className="text-blue-500 hover:underline">
                            Edit
                        </button>
                        <button onClick={() => onDelete(row[0])} className="ml-2 text-red-500 hover:underline">
                            Delete
                        </button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
);

export default CrudActionTable;
