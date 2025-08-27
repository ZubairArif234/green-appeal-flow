import { AuthLayout } from "@/components/auth/auth-layout";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

const ResetPassword = () => {
  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Secure your account with a new password"
    >
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
