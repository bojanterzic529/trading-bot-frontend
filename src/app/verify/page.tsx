"use client";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaMailBulk } from "react-icons/fa";
const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
export default function VerifyPage() {

    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [msg, setMsg] = useState("");
    useEffect(() => {
        const verify = async () => {
            try {
                const response = await axios.get(backendURL + "/api/auth/verify/" + token)
                setMsg(response.data.message)

            } catch (error: any) {
                setMsg(error.response.data.message)
            }
        }
        verify();
    }, [])
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <FaMailBulk className="text-foreground text-lg mb-2" size={50}></FaMailBulk>
            <p className="text-white">{msg}</p>
        </div>
    );
}