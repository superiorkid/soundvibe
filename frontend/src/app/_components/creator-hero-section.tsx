import { Button } from "@/components/ui/button";
import Image from "next/image";

const CreatorHeroSection = () => {
  return (
    <div className="h-full bg-foreground text-background grid grid-cols-2 items-center">
      <div className="flex items-start flex-col ps-24 space-y-7">
        <h1 className="text-4xl font-medium">Calling all creators</h1>
        <p className="font-medium text-lg">
          Get on SoundVibe to connect withn fans, share your sounds, and grow
          your audience. What are you waiting for?
        </p>

        <Button
          variant="secondary"
          size="lg"
          className="text-base font-semibold"
        >
          Find out more
        </Button>
      </div>
      <div className="relative size-full">
        <Image
          fill
          src="https://images.unsplash.com/photo-1600438379831-59dbf7269eac?q=80&w=1242&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="artists"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover brightness-75"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
};

export default CreatorHeroSection;
