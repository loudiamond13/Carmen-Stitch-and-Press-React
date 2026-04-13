



import {
     ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
    RadialBarChart, RadialBar,
    LabelList
} from 'recharts';
import type { HomePageResponse } from '../../api/api-types';
import StatCard from './stat-card';

interface DashboardProps {
    data: HomePageResponse
}

export default function FinancialAnalytics({ data }: DashboardProps) {
    // Data for the Efficiency Gauges
    const efficiencyData = [
        { name: 'Margin', value: data.dashboard.marginPercentage, fill: '#10b981' },
        { name: 'Expense Ratio', value: data.dashboard.expenseRatio, fill: '#ef4444' },
    ];

    // Data for Revenue vs Cash Flow
    const cashFlowData = [
        {
            name: 'Financial Totals',
            Revenue: data.dashboard.totalRevenue,
            Collected: data.dashboard.totalPayments,
            Expenses: data.dashboard.totalExpenses
        }
    ];

    return (
        <div className=" mx-2 min-h-screen space-y-6 rounded-2xl p-4">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                <StatCard  title="Net Profit" value={data.dashboard.netProfit} type="currency" color="text-emerald-600" />
                <StatCard title="Uncollected" value={data.dashboard.uncollected} type="currency" color="text-orange-600" />
                <StatCard title="Profit Margin" value={data.dashboard.marginPercentage} type="percent" color="text-blue-600" />
                <StatCard title="Expense Ratio" value={data.dashboard.expenseRatio} type="percent" color="text-red-600" />
            </div>

            <div className="flex flex-col gap-5">

                <div className="bg-dark rounded-xl p-6 shadow-lg lg:col-span-2">
                    <h3 className="mb-4 text-lg font-bold">Revenue vs. Cash Collection</h3>
                    <div className="h-100">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cashFlowData} 
                                barGap={15}>
                                <XAxis dataKey="name" hide />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                               
                               
                                <Bar dataKey="Revenue" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Total Revenue">
                                    <LabelList
                                        dataKey="Revenue"
                                        position="top"
                                        fill="#94a3b8"
                                      
                                        formatter={(val: any) => new Intl.NumberFormat("en-PH", { currency: "PHP", style: "currency" }).format(val)}
                                    />
                                </Bar>

                                
                                <Bar dataKey="Collected" fill="#10b981" radius={[4, 4, 0, 0]} name="Actual Cash">
                                    <LabelList
                                        dataKey="Collected"
                                        position="top"
                                        fill="#10b981"
                                        
                                        formatter={(val: any) => new Intl.NumberFormat("en-PH", { currency: "PHP", style: "currency" }).format(val)}
                                    />
                                </Bar>

                                
                                <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} name="Total Expense">
                                    <LabelList
                                        dataKey="Expenses"
                                        position="top"
                                        fill="#ef4444"
                                        className=""
                                        formatter={(val: any) => new Intl.NumberFormat("en-PH", { currency: "PHP", style: "currency" }).format(val)}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="mt-4 text-sm text-slate-500 italic">
                        *Ideally, 'Collected' should be as close to 'Revenue' as possible.
                    </p>
                </div>

                <div className="bg-dark rounded-xl p-6 shadow-lg">
                    <h3 className="mb-4 text-lg font-bold">Efficiency Ratios</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                cx="50%" cy="50%"
                                innerRadius="30%" outerRadius="100%"
                                barSize={20}
                                data={efficiencyData}
                            >
                                <RadialBar
                                    label={{
                                        position: 'insideStart',
                                        fill: '#fff',
                                        // Fix: Allow value to be any RenderableText and handle it safely
                                        formatter: (value: any) => value ? `${new Number(value).toFixed(2)}%` : ''
                                    }}
                                    background
                                    dataKey="value"
                                />
                                <Legend iconSize={10} layout="vertical" verticalAlign="bottom" align="right" />
                                <Tooltip />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}
