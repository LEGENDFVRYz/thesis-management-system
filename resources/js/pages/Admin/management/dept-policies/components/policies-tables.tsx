import EditIcon from '@/components/Icons/ic_edit-Default.svg';
import DeleteIcon from '@/components/Icons/ic_delete-Default.svg';

interface PoliciesHeaderProps {
    columns: string[];
}

export function PoliciesHeader({ columns }: PoliciesHeaderProps) {
    return (
        <thead className="bg-[#730000] text-white">
            <tr>
                {columns.map((column, index) => (
                    <th key={index} className="px-6 py-3 text-center text-base">
                        {column}
                    </th>
                ))}
            </tr>
        </thead>
    );
}

interface PoliciesRowProps {
    data: {
        name: string;
        value?: string;
        format?: string;
        status: string;
    };
    onEdit?: () => void;
    onDelete?: () => void;
}

export function PoliciesRow({ data, onEdit, onDelete }: PoliciesRowProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active':
                return '#0D542B';
            case 'Mandatory':
                return '#730000';
            default:
                return '#717182';
        }
    };

    return (
        <tr className="border-t">
            <td className="px-6 py-4 text-center text-sm-2">{data.name}</td>
            {data.value && <td className="px-6 py-4 text-center text-sm-2">{data.value}</td>}
            {data.format && <td className="px-6 py-4 text-center text-sm-2">{data.format}</td>}
            <td className="px-6 py-4 text-center text-sm-2">
                <span
                    className="px-4 py-1 rounded-full text-xs font-semibold text-white"
                    style={{
                        backgroundColor: getStatusColor(data.status),
                    }}
                >
                    {data.status}
                </span>
            </td>
            <td className="px-6 py-4 flex justify-center gap-3">
                {onEdit && (
                    <img
                        src={EditIcon}
                        className="w-6 h-6 cursor-pointer"
                        onClick={onEdit}
                    />
                )}
                {onDelete && (
                    <img
                        src={DeleteIcon}
                        className="w-6 h-6 cursor-pointer"
                        onClick={onDelete}
                    />
                )}
            </td>
        </tr>
    );
}
