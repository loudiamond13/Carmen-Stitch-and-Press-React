import { useForm } from "react-hook-form";
import type { LoginRequest } from "../api/api-types";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../../hooks/use-page-title";



export default function LoginPage() {
    usePageTitle("Login");
    const { isAuthenticated,login } = useAuth();

    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors} } = useForm<LoginRequest>();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/", {replace:true});
        }
    },[isAuthenticated,navigate])

    const onSubmit = handleSubmit(async (data) => {
        await login(data);

    })


    return (
        <div className="bg-background flex min-h-screen items-center justify-center px-4 py-12">
            <div className="bg-dark w-full max-w-md overflow-hidden rounded-2xl p-10 shadow-2xl">


                <div className="mb-10 text-center">
                    <h2 className="text-foreground text-3xl font-extrabold tracking-tight">
                        Welcome Back!
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                        Please enter your details to sign in
                    </p>
                </div>

                <form className="space-y-6" onSubmit={onSubmit} noValidate>

                    <div className="space-y-1">
                        <label className="text-foreground block text-sm font-semibold">
                            Email Address
                        </label>
                        <input
                            type="email"
                            autoFocus
                            placeholder="name@company.com"
                            className={`w-full border-b-2 bg-transparent py-2 transition-all duration-300 focus:outline-none ${errors.email
                                    ? "border-red-500 text-red-600 focus:border-red-600"
                                    : "border-slate-200 text-slate-900 focus:border-indigo-600"
                                }`}
                            {...register("email", { required: "Email is required." })}
                        />
                        {errors.email && (
                            <p className="animate-in fade-in slide-in-from-top-1 mt-1 text-xs font-medium text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>


                    <div className="space-y-1">
                        <label className="text-foreground block text-sm font-semibold">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className={`w-full border-b-2 bg-transparent py-2 transition-all duration-300 focus:outline-none ${errors.password
                                    ? "border-red-500 text-red-600 focus:border-red-600"
                                    : "border-slate-200 text-slate-900 focus:border-indigo-600"
                                }`}
                            {...register("password", {
                                required: "Password is required.",
                                minLength: { value: 6, message: "Must be at least 6 characters." }
                            })}
                        />
                        {errors.password && (
                            <p className="animate-in fade-in slide-in-from-top-1 mt-1 text-xs font-medium text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>


                    <div className="flex items-center justify-between">
                        <label htmlFor="rememberMe" className="group flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-600 select-none">
                            <input
                                id="rememberMe"
                                type="checkbox"
                                className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 transition focus:ring-indigo-500"
                                {...register("rememberMe")}
                            />
                            <span className="transition-colors group-hover:text-slate-900">Remember me</span>
                        </label>
                        <a href="#" className="text-foreground text-sm font-semibold hover:text-indigo-500 hover:underline">
                            Forgot password?
                        </a>
                    </div>


                    <button
                        type="submit"
                        className="bg-foreground text-light w-full rounded-xl px-4 py-3 text-sm font-bold shadow-lg transition-all duration-200 hover:bg-slate-800 hover:shadow-xl active:scale-[0.98]"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
