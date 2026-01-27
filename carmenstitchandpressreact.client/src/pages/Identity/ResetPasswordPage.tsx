import type { JSX } from "react";
import { useSearchParams } from "react-router-dom";
import toastr from "toastr" 




export default function ResetPasswordPage(): JSX.Element {
    const [searchParams] = useSearchParams();

    const email = searchParams.get("email");
    const code = searchParams.get("code");

    console.log(email);
    toastr.success(email?.toString());


    return (<></>);

}