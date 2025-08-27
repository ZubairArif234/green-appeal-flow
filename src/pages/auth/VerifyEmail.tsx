import { AuthLayout } from "@/components/auth/auth-layout";
import { VerifyEmailForm } from "@/components/auth/verify-email-form";

const VerifyEmail = () => {
  return (
    <AuthLayout
      title="Verify your email"
      subtitle="Please check your inbox for the verification code"
    >
      <VerifyEmailForm />
    </AuthLayout>
  );
};

export default VerifyEmail;
