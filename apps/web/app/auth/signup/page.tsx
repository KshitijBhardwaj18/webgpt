import { AuthCard } from "@/components/auth/authCard";
import SignUpForm from "@/components/auth/signupForm";

export default function SignUpPage() {
  return (
    <div className="flex h-screen items-center justify-center">
      <AuthCard subheading="">
        <SignUpForm />
      </AuthCard>
    </div>
  );
}
