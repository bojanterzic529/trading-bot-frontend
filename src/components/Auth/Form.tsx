"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";

export default function AuthForm({ isLogin }: { isLogin: boolean }) {
  const router = useRouter();
  const { login, signup, userData } = useAuth();

  useEffect(() => {
    if (userData) {
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
        await signup(
          formData.email,
          formData.password,
          formData.confirmPassword
        );
      }
    } catch (error: any) {
      setError(error.message as string);
    }
  };

  return (
    <div className="flex flex-col items-center bg-background-dark p-8 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        {isLogin ? "Login" : "Sign Up"}
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
          {isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>
      <p className="text-sm text-gray-400 mt-6">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <Link
          href={isLogin ? "/sign-up" : "/login"}
          className="text-foreground hover:underline ml-1">
          {isLogin ? "Sign Up" : "Log In"}
        </Link>
      </p>
    </div>
  );
}
