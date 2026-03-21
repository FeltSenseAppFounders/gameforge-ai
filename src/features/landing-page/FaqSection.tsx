"use client";

import { useState } from "react";
import { AnimateOnScroll } from "./AnimateOnScroll";

const faqs = [
  {
    question: "What kinds of games can MAX create?",
    answer:
      "MAX specializes in 2D browser games using Phaser.js — space shooters, platformers, puzzle games, racing games, RPGs with tile-based movement, and more. If it can be built with 2D sprites and physics, MAX can build it.",
  },
  {
    question: "Do I need to know how to code?",
    answer:
      "Not at all. Just describe what you want in plain English. \"Make me a space shooter with power-ups\" or \"Create a platformer where I collect coins\" — MAX handles all the code.",
  },
  {
    question: "Can I export the game code?",
    answer:
      "Yes! Pro users can export the complete HTML/JavaScript source code. The games are self-contained — just open the HTML file in any browser to play. You own your code.",
  },
  {
    question: "How does the iteration work?",
    answer:
      "After MAX generates your initial game, just keep chatting. Say \"add a health bar\" or \"make the enemies faster\" and MAX regenerates the complete game with your changes. You see updates instantly in the preview.",
  },
  {
    question: "Are the games actually playable?",
    answer:
      "Yes — 98% of games are playable on first generation. They use real Phaser.js with physics, collisions, keyboard controls, scoring, and game-over states. These are real games, not mockups.",
  },
  {
    question: "Can I share my games with others?",
    answer:
      "Absolutely. Publish any game to the community gallery where other creators can play, like, and get inspired by your work. You can also share direct links to your games.",
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
      className={`text-neutral-500 shrink-0 transition-transform duration-200 ${
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
    <section id="faq" className="bg-surface py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <AnimateOnScroll className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-primary-light mb-3">
            FAQ
          </p>
          <h2 className="text-3xl md:text-4xl font-heading text-neutral-100 mb-4 uppercase">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </AnimateOnScroll>

        {/* Accordion */}
        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            const id = `faq-${i}`;

            return (
              <AnimateOnScroll key={faq.question} delay={i * 0.05}>
                <div className="border border-neutral-700 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left bg-surface hover:bg-surface-light transition-colors duration-150 min-h-[44px]"
                    aria-expanded={isOpen}
                    aria-controls={`${id}-panel`}
                    id={`${id}-trigger`}
                  >
                    <span className="text-base font-semibold text-neutral-200 pr-4">
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
                      <div className="px-6 pb-5 text-base text-neutral-400 leading-relaxed">
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
