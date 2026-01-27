
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import type { LoginRequest } from "../../types/api-types";

import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import PageTitle from "../../hooks/PageTitle";


const LoginPage = () => {

    PageTitle("Login");

    const { login,isAuthenticated } = useAuth();
    const navigate = useNavigate();


    const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();


    useEffect(() => {
        if (isAuthenticated) {
            //navigate to homepage if user is already logged in
            navigate("/", {replace: true})
        }
    },[isAuthenticated,])

    const onSubmit = handleSubmit(async (data) => {

        await login(data);
        
    });


    return (

        <form onSubmit={onSubmit} className=" p-5 mb-5 align-content-center" >
            <div className="card p-4 bg-dark rounded-4 border-0 shadow-lg">
                <h1 className="fw-bold text-darker">Login</h1>
                <div className="row">
                    <label className="form-label col-md-6 text-darker">
                        <input type="email" className="form-control" placeholder="Email"
                            {...register(`email`, { required: `Email is required.` })} />
                        {
                            errors.email &&
                            (<span className="text-danger">{errors.email.message}</span>)
                        }
                    </label>
                    <label className="form-label col-md-6 text-darker">
                        <input type="Password" className="form-control" placeholder="Password"
                            {...register('password', {
                                required: 'Password is required.',
                                minLength: { value: 6, message: "Should be at least 6 characters." },
                            })}
                        />
                        {
                            //displays the error message
                            errors.password &&
                            (<span className="text-danger">{errors.password.message}</span>)
                        }
                    </label>
                    

                </div>
                <div className="form-check ">
                    
                    <label className="form-check-label text-darker" htmlFor="checkDefault">Remember me?
                        <input className="form-check-input" type="checkbox" id="checkDefault"
                            {...register("rememberMe")}
                        />
                    </label>
                </div>

                <div>
                    <Link to='/forgot-password' className="my-2">Forgot Password?</Link>
                </div>
                <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-darker fw-medium">Sign In</button>
                </div>
            </div>
        </form>

    );

}

export default LoginPage;