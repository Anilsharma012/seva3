import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import MissionSection from "@/components/home/MissionSection";
import AboutPreview from "@/components/home/AboutPreview";
import ProgramsPreview from "@/components/home/ProgramsPreview";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <MissionSection />
      <AboutPreview />
      <ProgramsPreview />
      <TestimonialsSection />
      <CTASection />
    </Layout>
  );
};

export default Index;
