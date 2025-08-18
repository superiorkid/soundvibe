import AppFooter from "@/app/_components/app-footer";
import AuthCard from "@/components/auth-card";
import { Suspense } from "react";
import { H3 } from "shadcn-typography";

const SignInPage = () => {
  return (
    <div className="mt-12">
      <H3 className="max-w-md text-center mx-auto font-medium leading-snug">
        Join SoundVibe to hear the latest from people you follow
      </H3>
      <Suspense>
        <AuthCard />
      </Suspense>
      <footer className="mt-16 flex justify-center">
        <AppFooter className="text-center text-gray-700 text-sm">
          <AppFooter.Brand name="SoundVibe" />
          <AppFooter.Language label="English (US)" />
        </AppFooter>
      </footer>
    </div>
  );
};

export default SignInPage;
