
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import type { HomePageResponse } from "../../api/api-types";
import FinancialAnalytics from "./financial-analytics";


interface HomePageComponentProps {
    data: HomePageResponse | undefined,
    onYearChange: (year: number) => void,
    currentYear: number | null,
    currentUserName:string|null
}



export default function HomePageComponent({ data, onYearChange, currentYear,currentUserName }: HomePageComponentProps) {

    if (data == undefined) return null;

    return (
        <div className="text-foreground pt-2">
            <div className="flex items-center justify-between gap-2 px-4 pt-3">
                <div>
                    <span className=" text-3xl font-semibold">Welcome, {currentUserName}!</span>
                </div>
                <div className="flex items-center gap-2">
                    <span>Year:</span>
                    <Select
                        onValueChange={(value) => onYearChange(Number(value))}
                        value={String(currentYear)}

                    >
                        <div className="w-28">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Year" />
                            </SelectTrigger>
                        </div>
                        <SelectContent>
                            <SelectItem value="0">All</SelectItem>
                            {data.years.map((year) => (
                                <SelectItem key={year} value={String(year)}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="flex flex-wrap justify-center gap-5 py-5">
                <FinancialAnalytics data={data } />
            </div>
        </div>
    );
}