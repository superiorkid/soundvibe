"use client";

import { SocialButton } from "@/app/_components/social-button";
import DeviconGithub from "@/components/icons/DeviconGithub";
import DeviconGoogle from "@/components/icons/DeviconGoogle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

const SignInPage = () => {
  const handleSocialLogin = async (provider: "github" | "google") => {
    await authClient.signIn.social({
      provider,
      callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/discover`,
    });
  };

  return (
    <div className="max-w-lg mt-12 mx-auto">
      <Card className="shadow-none border rounded-sm">
        <CardHeader>
          <CardTitle className="text-3xl max-w-sm font-bold">
            Sign in or create an account?
          </CardTitle>
          <CardDescription className="text-sm tracking-wide leading-relaxed">
            By clicking on any of the &quot;Continue&quot; buttons below, you
            agree to Soundvibe&quot;s{" "}
            <span className="text-sky-600">Terms of use</span> and acknowledge
            our <span className="text-sky-600">Privacy Policy</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <SocialButton
            size="lg"
            variant="outline"
            onClick={() => handleSocialLogin("github")}
          >
            <SocialButton.Icon icon={DeviconGithub} />
            <SocialButton.Text>Continue with GitHub</SocialButton.Text>
          </SocialButton>

          <SocialButton size="lg" onClick={() => handleSocialLogin("google")}>
            <SocialButton.Icon icon={DeviconGoogle} />
            <SocialButton.Text>Continue with Google</SocialButton.Text>
          </SocialButton>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
