import AuthForm from "@/components/Auth/Form";

export default function SigninPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <AuthForm isLogin={true} />
    </div>
  );
}
