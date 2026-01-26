import { useEffect } from "react";

function PageTitle(title:string) {
    useEffect(() => {
        document.title = `Carmen Stitch & Press | ${title}`;
    },[title]);
}

export default PageTitle;