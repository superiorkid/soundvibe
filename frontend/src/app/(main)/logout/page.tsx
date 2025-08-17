import { H2, Lead } from "shadcn-typography";

const LogoutPage = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-20">
      <H2 className="border-none tracking-wide">You&apos;ve signed out.</H2>
      <Lead className="max-w-lg text-center">
        You can still explore and stream music anonymously. Log back in anytime
        to manage your uploads and playlists.
      </Lead>
    </div>
  );
};

export default LogoutPage;
