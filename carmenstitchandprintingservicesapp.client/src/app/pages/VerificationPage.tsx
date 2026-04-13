import { useForm } from "react-hook-form";
import type { VerificationRequest } from "../api/api-types";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { CheckCircle2, RefreshCcw, ShieldCheckIcon } from "lucide-react";
import usePageTitle from "../../hooks/use-page-title";




export default function VerificationPage() {
    usePageTitle("Verify");
    const { handleSubmit, register,formState: { isSubmitting} } = useForm<VerificationRequest>();
    const {verify } = useAuth();
    const location = useLocation();
    const email = location.state?.email;
    const rememberMe = location.state?.rememberMe;

    const onSubmit = handleSubmit(async (data) => {
        data.email = email;
        data.rememberMe = rememberMe;

        await verify(data);
    });

    return (
        <div className="bg-background flex min-h-screen items-center justify-center px-4">
            <div className="bg-dark w-full max-w-md rounded-2xl p-10 shadow-2xl">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <ShieldCheckIcon size={32} />
                    </div>
                    <h2 className="text-foreground text-2xl font-bold">Security Verification</h2>
                    <p className="mt-2 text-sm text-slate-500">Enter the code sent to your email</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-8">
                    <div className="relative">
                        <input
                            type="text"
                            maxLength={6}
                            placeholder="000000"
                            className="w-full border-b-2 border-slate-200 bg-transparent py-4 text-center font-mono text-4xl tracking-[0.3em] transition-all focus:border-emerald-500 focus:outline-none"
                            {...register("code", { required: "Required" })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 font-bold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-700 disabled:opacity-50"
                    >
                        {isSubmitting ? <RefreshCcw className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                        {isSubmitting ? "Checking..." : "Verify Code"}
                    </button>

                
                </form>
            </div>
        </div>
    );

    
}