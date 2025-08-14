"use client";
import React, { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";    

const LoginForm = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    console.log(name ,password)
    async function handleSubmit(e) {
        e.preventDefault();
        const res = await signIn("credentials", {
            username: name,
            password,
            redirect: false, // Prevent redirect here
        });

        if (res?.error) {
            // Handle login error
            setError("Invalid username or password");
        } else if (res?.ok) {
            router.push("/admin");
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 p-5 max-w-xs w-full bg-white shadow-lg rounded-lg border"
        >
            <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Email or Username</label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text"
                        className="p-3 border border-slate-700 rounded-lg"
                        id="name"
                        placeholder="Uname@mail.com"
                        required
                    />
                </div>
                <div className="flex mt-2 flex-col gap-2">
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        type="password"
                        id="password"
                        className="p-3 border border-slate-700 rounded-lg"
                        placeholder="Password"
                        required
                    />
                </div>
            </div>

            {error && <div className="text-red-600 mt-2">{error}</div>} {/* Show error message */}

            <button
                type="submit"
                className="mt-4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-500"
            >
                Sign in
            </button>
        </form>
    );
};

export default LoginForm;
