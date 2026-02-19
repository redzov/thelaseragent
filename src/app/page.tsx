import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import BrandsGrid from "@/components/home/BrandsGrid";
import TestimonialsSlider from "@/components/home/TestimonialsSlider";
import RecentBlogPosts from "@/components/home/RecentBlogPosts";
import HomeContactForm from "@/components/home/HomeContactForm";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
      <div className="h-px bg-[#1a1a1a]" />
      <WhyChooseUsSection />
      <BrandsGrid />
      <TestimonialsSlider />
      <RecentBlogPosts />
      <HomeContactForm />
    </div>
  );
}
