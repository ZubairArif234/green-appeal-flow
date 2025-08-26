import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "How does the AI analyze my denial documents?",
      answer: "Our AI uses advanced natural language processing and machine learning algorithms trained on CMS and AMA guidelines. It can read and interpret denial codes, identify specific issues, and provide targeted guidance for appeals. The system works with both text-based denials and scanned documents."
    },
    {
      question: "Is my patient data secure and HIPAA compliant?",
      answer: "Absolutely. Our system is designed to work with redacted documents and screenshots, meaning no PHI (Protected Health Information) is required. We follow strict HIPAA guidelines and use enterprise-grade encryption to protect all data. You can safely upload denial documents with patient information removed."
    },
    {
      question: "What types of denials can the AI help with?",
      answer: "Our AI can assist with a wide range of medical denials including prior authorization denials, claim denials for medical necessity, coding issues, documentation requirements, and coverage determinations. It works across all major insurance providers and understands both commercial and government payer requirements."
    },
    {
      question: "How accurate is the AI guidance?",
      answer: "Our AI provides highly accurate guidance based on current CMS and AMA guidelines with over 95% accuracy in identifying denial reasons and suggesting appropriate appeal strategies. However, we always recommend having qualified medical billing professionals review the AI recommendations before submitting appeals."
    },
    {
      question: "Can I integrate this with my existing billing system?",
      answer: "Yes, our Enterprise plan includes custom integrations with popular EHR and billing systems. We can work with your IT team to set up automated workflows that fit seamlessly into your existing processes. Contact our sales team to discuss specific integration requirements."
    },
    {
      question: "What support is available during implementation?",
      answer: "We provide comprehensive support including onboarding assistance, staff training sessions, detailed documentation, and ongoing technical support. Our Enterprise customers receive dedicated account management and priority support with guaranteed response times."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Frequently Asked
            <span className="text-primary block">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about our AI-powered denial assistant.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-2xl px-6 bg-card hover:shadow-card transition-smooth"
              >
                <AccordionTrigger className="text-left text-lg font-semibold text-black hover:text-primary transition-smooth py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
