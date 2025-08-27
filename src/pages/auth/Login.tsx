import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";

const Login = () => {
  return (
    <AuthLayout
      title="Sign In"
      subtitle="Access your medical denial analysis dashboard"
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
