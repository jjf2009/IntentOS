"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is IndentOS?",
    answer:
      "IndentOS is a modern, identity-first operating system designed to reduce digital noise and help users work with clarity, structure, and intention.",
  },
  {
    question: "Who is IndentOS built for?",
    answer:
      "IndentOS is built for developers, creators, students, and professionals who value focus, minimalism, and long-term system stability over unnecessary complexity.",
  },
  {
    question: "How is IndentOS different from traditional operating systems?",
    answer:
      "Traditional operating systems prioritize feature accumulation. IndentOS prioritizes cognitive flow, identity-based workflows, and a distraction-free environment.",
  },
  {
    question: "Is IndentOS secure?",
    answer:
      "Yes. IndentOS is designed with security as a first-class concern, incorporating strict permission boundaries, identity-aware access controls, and a hardened system architecture.",
  },
  {
    question: "Can I customize IndentOS?",
    answer:
      "IndentOS allows customization without compromising structure. You can tailor workflows, profiles, and layouts while maintaining a clean, consistent system experience.",
  },
  {
    question: "Is IndentOS free to use?",
    answer:
      "IndentOS offers a free tier for individuals, with advanced capabilities available through premium plans as the platform evolves.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faqs"
      className="w-full bg-gray-50 px-6 py-20 sm:px-10 lg:px-20"
    >
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Clear answers to common questions about IndentOS.
          </p>
        </div>

        <div className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {faqs.map((faq, index) => (
            <button
              key={index}
              onClick={() => toggleFAQ(index)}
              className="w-full px-6 py-6 text-left transition hover:bg-gray-50 focus:outline-none"
              aria-expanded={openIndex === index}
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">
                  {faq.question}
                </span>
                <span className="ml-4 text-xl font-medium text-gray-500">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>

              {openIndex === index && (
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-600">
                  {faq.answer}
                </p>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
