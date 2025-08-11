import CreatorHeroSection from "./_components/creator-hero-section";
import HeroSearch from "./_components/hero-search-section";
import HeroSection from "./_components/hero-section";
import JoinUsSection from "./_components/join-us-section";

const LandingPage = () => {
  return (
    <div>
      <section className="h-[457px] mt-5">
        <HeroSection />
      </section>
      <section className="h-[282px] flex items-center">
        <HeroSearch />
      </section>
      <section className="h-[383px]">
        <CreatorHeroSection />
      </section>
      <section className="h-[340px]">
        <JoinUsSection />
      </section>
    </div>
  );
};

export default LandingPage;
