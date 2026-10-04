import React from "react";
import SectionContainer from "./SectionContainer";
import SectionTitle from "./SectionTitle";
import TrustBadge from "./TrustBadge";

const WhyChooseUs = ({
  title = "Why Choose Lavi Mobile?",
  subtitle = "A trusted place for your smartphone shopping",
}) => {
  const benefits = [
    {
      icon: "🚚",
      title: "Fast Delivery",
      description: "Get your products delivered quickly and safely.",
      variant: "orange",
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      description: "Your payment and personal information are protected.",
      variant: "blue",
    },
    {
      icon: "✓",
      title: "Genuine Products",
      description: "Shop confidently with authentic products.",
      variant: "green",
    },
    {
      icon: "↩",
      title: "Easy Returns",
      description: "Simple and convenient return support.",
      variant: "purple",
    },
  ];

  return (
    <SectionContainer>
      <SectionTitle title={title} subtitle={subtitle} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map((benefit) => (
          <TrustBadge
            key={benefit.title}
            icon={benefit.icon}
            title={benefit.title}
            description={benefit.description}
            variant={benefit.variant}
          />
        ))}
      </div>
    </SectionContainer>
  );
};

export default WhyChooseUs;
