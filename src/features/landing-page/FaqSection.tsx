"use client";

import { useState } from "react";
import { AnimateOnScroll } from "./AnimateOnScroll";

const faqs = [
  {
    question: "Is FeltSense Clinic HIPAA compliant?",
    answer:
      "Yes. All data is encrypted in transit and at rest. We sign BAAs with every customer and maintain SOC 2 Type II compliance. Your patient data is never used to train AI models.",
  },
  {
    question: "How accurate is the AI?",
    answer:
      "Our AI achieves 97%+ accuracy on appointment booking and insurance verification. For complex cases, it seamlessly hands off to your staff with full conversation context.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most practices are live within 24 hours. Connect your PMS, configure your preferences, and the AI starts handling calls immediately. Our onboarding team guides you through every step.",
  },
  {
    question: "Will patients know they're talking to AI?",
    answer:
      "The AI introduces itself transparently. Patients appreciate the instant response — no hold times, no phone trees. Our natural voice models sound conversational, not robotic.",
  },
  {
    question: "What if the AI can't handle a call?",
    answer:
      "Instant human handoff. The AI transfers to your staff with full context of the conversation so patients never have to repeat themselves. You set the escalation rules.",
  },
  {
    question: "Can I try before I commit?",
    answer:
      "Absolutely. We offer a 14-day free trial with full functionality. Book a demo and we'll get you set up in minutes. No credit card required.",
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      className={`text-neutral-400 shrink-0 transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-bold font-heading text-neutral-800 mb-4">
            Frequently Asked Questions
          </h2>
        </AnimateOnScroll>

        {/* Accordion */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const id = `faq-${i}`;

            return (
              <AnimateOnScroll key={faq.question} delay={i * 0.05}>
                <div className="border border-neutral-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left bg-white hover:bg-neutral-50 transition-colors duration-150 min-h-[44px]"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-panel`}
                    id={`${id}-trigger`}
                  >
                    <span className="text-base font-semibold text-neutral-800 pr-4">
                      {faq.question}
                    </span>
                    <ChevronIcon open={isOpen} />
                  </button>

                  <div
                    id={`${id}-panel`}
                    role="region"
                    aria-labelledby={`${id}-trigger`}
                    className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-5 text-base text-neutral-600 leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
