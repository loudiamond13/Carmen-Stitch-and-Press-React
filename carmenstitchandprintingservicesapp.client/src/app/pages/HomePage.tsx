import { useQuery } from "@tanstack/react-query";
import HomePageComponent from "../components/Home/home-page";
import { useQueryStates } from "nuqs";
import { searchHomePageParams } from "../lib/search-params";
import * as api from "../api/api-client";
import LoadingScreen from "../../components/LoadingScreen";
import { useAuth } from "../../contexts/AuthContext";
import usePageTitle from "../../hooks/use-page-title";



export default function HomePage() {
    usePageTitle("Dashboard");

    const { user } = useAuth();

    const [search, setSearch] = useQueryStates(searchHomePageParams, {
        history: "replace",
        
    });

    const query = useQuery({
        queryKey: ["home", search],
        queryFn: async () => {
            const data = await api.getDistinctYears({...search});
            return { data };
        }
    });

    if (query.isLoading) {
        return <LoadingScreen/>
    }

    return (
        <HomePageComponent
            data={query.data?.data ?? undefined}
            onYearChange={(newYear) => setSearch({ year: newYear })}
            currentYear={search.year}
            currentUserName={user?.firstName??""}
        />
    );
}