import React from 'react';
import AboutHero from '../component/organism/About/AboutHero';
import HowItWorksSection from '../component/organism/About/HowItWorksSection';
import IngredientStandardSection from '../component/organism/About/IngredientStandardSection';
import CertificatesSection from '../component/organism/About/CertificatesSection';
import CTASection from '../component/organism/About/CTASection';

export default function About() {
  return (
    <div className="w-full page-enter bg-bg-main min-h-screen">
      <AboutHero />
      <HowItWorksSection />
      <IngredientStandardSection />
      <div className="pb-16 pt-8">
        <CertificatesSection />
      </div>
      <CTASection />
    </div>
  );
}
