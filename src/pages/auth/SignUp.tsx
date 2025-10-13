import { AuthLayout } from "@/components/auth/auth-layout";
import { SignUpForm } from "@/components/auth/signup-form";

const SignUp = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join our growing network of providers"
    >
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
