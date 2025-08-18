"use client";

import { SocialButton } from "@/app/_components/social-button";
import { authClient } from "@/lib/auth-client";
import { useQueryState } from "nuqs";
import DeviconGithub from "./icons/DeviconGithub";
import DeviconGoogle from "./icons/DeviconGoogle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const AuthCard = () => {
  const [callback] = useQueryState("callback");

  const handleSocialLogin = async (provider: "github" | "google") => {
    const callbackUrl =
      callback && callback.trim().length > 0 ? callback : "/discover";

    await authClient.signIn.social({
      provider,
      callbackURL: `${process.env.NEXT_PUBLIC_FRONTEND_URL}${callbackUrl}`,
    });
  };

  return (
    <div className="max-w-lg mt-12 mx-auto">
      <Card className="rounded-sm shadow-none border border-zinc-400">
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

export default AuthCard;
