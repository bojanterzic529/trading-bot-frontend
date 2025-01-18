import AuthForm from "@/components/Auth/Form";

export default function ResetPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <AuthForm isLogin={false} isReset={true} />
    </div>
  );
}
