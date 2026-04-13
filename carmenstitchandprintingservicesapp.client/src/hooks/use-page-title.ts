import { useEffect } from "react";


export default function usePageTitle(title:string) {
    useEffect(() => {
        document.title = `${title} | Carmen's Stitch & Printing Srvcs`;
    },[title])
}