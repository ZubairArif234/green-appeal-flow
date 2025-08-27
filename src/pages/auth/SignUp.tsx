import { AuthLayout } from "@/components/auth/auth-layout";
import { SignUpForm } from "@/components/auth/signup-form";

const SignUp = () => {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of healthcare providers using Green Appeal"
    >
      <SignUpForm />
    </AuthLayout>
  );
};

export default SignUp;
