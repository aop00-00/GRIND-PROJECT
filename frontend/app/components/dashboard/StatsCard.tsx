// app/components/dashboard/StatsCard.tsx
interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
}

export default function StatsCard({ title, value, icon }: StatsCardProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                {icon && <div className="text-gray-400">{icon}</div>}
            </div>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    );
}
