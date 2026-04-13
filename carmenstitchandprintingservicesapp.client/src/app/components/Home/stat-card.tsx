




interface StatCardProps {
    title: string;
    value: number;
    type: 'currency' | 'percent';
    color:string;
}



export default function StatCard({ title, value, type, color }: StatCardProps) {
    const formattedValue = type === 'currency'
        ? new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value)
        : `${value.toFixed(2)}%`;

    return (
        <div className="bg-dark rounded-xl p-4 shadow-lg">
            <p className="text-foreground text-xs font-semibold tracking-wider uppercase">{title}</p>
            <p className={`text-2xl font-black mt-1 ${color}`}>{formattedValue}</p>
        </div>
    );
}