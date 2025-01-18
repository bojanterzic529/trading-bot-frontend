"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

export default function AuthForm({ isLogin, isReset }: { isLogin: boolean, isReset: boolean }) {
  const router = useRouter();
  const { login, signup, resetPassword, userData } = useAuth();

  useEffect(() => {
    if (userData && !isReset) {
      router.push("/");
    }
  }, [userData, router]);

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (isReset) {
          const response = await resetPassword(
            formData.email,
            formData.password,
            formData.confirmPassword
          );
          setError("");
          toast.success(response.message);
        } else {
          const response = await signup(
            formData.email,
            formData.password,
            formData.confirmPassword
          );
          console.log('response', response)
          setError("");
          toast.success(response.message);
        }
      }
    } catch (error: any) {
      setError(error.message as string);
      toast.error(error.message as string)
    }
  };

  return (
    <div className="flex flex-col items-center bg-background-dark p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {isLogin ? "Login" : isReset ? "Reset Password" : "Sign Up"}
      </h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-white mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded bg-background-light text-white outline-none focus:ring-2 focus:ring-foreground"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-white mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 rounded bg-background-light text-white outline-none focus:ring-2 focus:ring-foreground"
            required
          />
        </div>
        {!isLogin && (
          <div className="mb-4">
            <label className="block text-white mb-2">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-3 rounded bg-background-light text-white outline-none focus:ring-2 focus:ring-foreground"
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full py-3 mt-4 bg-foreground rounded text-background-dark font-semibold hover:bg-foreground/90 transition">
          {isLogin ? "Log In" : isReset ? "Reset Password" : "Sign Up"}
        </button>
      </form>
      {isLogin &&
        <p className="text-sm text-gray-400 mt-6">
          Don't have an account?
          <Link
            href={"/sign-up"}
            className="text-foreground hover:underline ml-1">
            Sign Up
          </Link>
        </p>
      }
      {!isLogin &&
        <p className="text-sm text-gray-400 mt-6">
          Already have an account?
          <Link
            href={"/login"}
            className="text-foreground hover:underline ml-1">
            Log In
          </Link>
        </p>
      }
      {!isLogin && isReset &&
        <p className="text-sm text-gray-400 mt-6">
          Don't have an account?
          <Link
            href={"/sign-up"}
            className="text-foreground hover:underline ml-1">
            Sign Up
          </Link>
        </p>
      }
      {!isReset &&
        <p className="text-sm text-gray-400 mt-6">
          <Link
            href={"/reset-password"}
            className="text-foreground hover:underline ml-1">
            Forgot Password?
          </Link>
        </p>
      }
    </div>
  );
}
