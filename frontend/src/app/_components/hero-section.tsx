import Image from "next/image";
import { AppBrand } from "./app-brand";
import AuthDialog from "./auth-dialog";
import { Button } from "@/components/ui/button";

// TODO: add carousel
const HeroSection = () => {
  return (
    <div className="border px-10 py-9 h-full rounded-xl relative text-background overflow-hidden">
      <div className="flex justify-between items-center">
        <AppBrand>
          <AppBrand.Icon size={28} />
          <AppBrand.Link href="/" className="uppercase text-xl tracking-wide">
            Soundvibe
          </AppBrand.Link>
        </AppBrand>
        <div className="flex gap-1.5 items-center">
          <AuthDialog>
            <Button size="sm" variant="secondary" className="rounded-sm">
              Sign In
            </Button>
          </AuthDialog>
          <AuthDialog>
            <Button size="sm" className="rounded-sm">
              Create Account
            </Button>
          </AuthDialog>
        </div>
      </div>
      <div className="grid grid-cols-2 absolute bottom-11 gap-8 pr-8">
        <div className="col-span-2 grid grid-cols-2">
          <div className="space-y-5">
            <h1 className="text-5xl font-bold leading-tight">
              <span>Discover</span>
              <br />
              <span>Get Discovered</span>
            </h1>
            <p className="font-medium leading-relaxed">
              Discover your next obsession, or become someone else&quot;s.
              SoundVibe is the only community where fans and artists come
              together to discover and connect through music.
            </p>
          </div>
        </div>
        <div>
          <AuthDialog>
            <Button
              variant="secondary"
              className="font-semibold text-base"
              size="lg"
            >
              Get Started
            </Button>
          </AuthDialog>
        </div>
        <div className="text-sm text-end">
          <h2 className="font-semibold text-xs">DC the Don</h2>
          <p className="">SoundVibe Artist Pro</p>
        </div>
      </div>

      <Image
        fill
        src="https://images.unsplash.com/photo-1621586556026-98b104442283?q=80&w=1468&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="dummy musician image"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        decoding="async"
        className="object-cover brightness-50 saturate-50 -z-10"
      />
    </div>
  );
};

export default HeroSection;
