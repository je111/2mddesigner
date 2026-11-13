import Hero from '../components/Hero';
import Services from '../components/Services';
import FeaturedProducts from '../components/FeaturedProducts';
import Collaborations from '../components/Collaborations';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <FeaturedProducts />
      <Collaborations />
      <Stats />
      <Testimonials />
      <CTA />
    </>
  );
}