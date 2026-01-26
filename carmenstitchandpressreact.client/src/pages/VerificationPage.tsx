import { useForm } from "react-hook-form";
import type { VerificationRequest } from "../types/api-types";
import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";






const VerificationPage = () => {
    const {verify } = useAuth();
  
    const { register, handleSubmit, formState: { errors } } = useForm<VerificationRequest>();
    const location = useLocation();
    const email = location.state?.email;
    const rememberMe = location.state?.rememberMe;

    const onSubmit = handleSubmit(async (data) => {
        data.email = email;
        data.rememberMe = rememberMe;

        await verify(data);

       
    });

    return (
        <div className="d-flex  justify-content-center align-items-center min-vh-100">
            <div className="card border-0 shadow rounded-4 bg-dark p-5  ">
            <p className="fs-2">Verification Code</p>
                <form onSubmit={onSubmit} className="">
                    <div className="row g-2 align-items-center">
                        <div className="col-auto">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Code"
                                {...register("code", { required: "Verification Code Required!" })}
                            />
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-outline-darker" type="submit">
                                Submit
                            </button>
                        </div>
                    </div>

                    {errors.code && (
                        <div className="mt-2">
                            <span className="text-danger">{errors.code.message}</span>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default VerificationPage;