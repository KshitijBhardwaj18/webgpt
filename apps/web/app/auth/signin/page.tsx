import { AuthCard } from "@/components/auth/authCard";
import SignInForm from "@/components/auth/signinForm";

export default function SignInPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <AuthCard subheading="">
        <SignInForm />
      </AuthCard>
    </div>
  );
}
