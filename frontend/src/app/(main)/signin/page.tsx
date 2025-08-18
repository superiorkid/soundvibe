import AuthCard from "@/components/auth-card";
import { H3 } from "shadcn-typography";

const SignInPage = () => {
  return (
    <div className="mt-12">
      <H3 className="max-w-md text-center mx-auto font-medium leading-snug">
        Join SoundVibe to hear the latest from people you follow
      </H3>
      <AuthCard />
    </div>
  );
};

export default SignInPage;
