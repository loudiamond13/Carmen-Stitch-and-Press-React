import { useRef, type JSX } from "react";
import PageTitle from "../../hooks/PageTitle";
import { useForm } from "react-hook-form";
import { forgotPassword } from "../../api-client";
import toastr from "toastr";
import { useNavigate } from "react-router-dom";
import { useAsyncLoading } from "../../hooks/useAsyncLoading";


type ForgotPasswordRequest = {
    email: string;
}

export default function ForgotPasswordPage(): JSX.Element {

    PageTitle("Forgot Password");

    const {runAsync } = useAsyncLoading();
    const { handleSubmit, register,reset, formState: { errors} } = useForm<ForgotPasswordRequest>();

    const emailRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const onSubmit = handleSubmit( async (data) => {
        
        try {
            await runAsync(forgotPassword(data.email));
            toastr.success("Reset link sent!");
            navigate("/login");
        }
        catch (error: any) {
            toastr.error(error.message);
            reset({ email: "" });
            emailRef.current?.focus();
        }
    });



    return (
        <div className="d-flex pt-5 justify-content-center ">
            <div className="card p-4 bg-dark rounded-4 border-0 shadow-lg">
                <h1>Forgot Password</h1>
                <form onSubmit={onSubmit} className="d-flex flex-column gap-3">
                    <div>
                        <label className="form-label text-darker w-100" >
                            <input type="email" className="form-control " placeholder="Email"
                                {...register(`email`, { required: `Email is required.` })}
                                ref={(e) => {
                                    register("email").ref(e); //maintain react-hook-form registration
                                    emailRef.current = e;     //assign to our ref
                                }}
                            />
                            {
                                errors.email &&
                                (<span className="text-danger">{errors.email.message}</span>)
                            }
                        </label>
                    </div>
                    <button type="submit" className=" btn btn-darker ">
                        Send Reset Link
                    </button>

                </form>
            </div>
        </div>
    );
}