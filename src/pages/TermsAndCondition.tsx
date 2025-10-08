import { Footer2 } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import React from "react";

const TermsAndConditions = () => {
  return (
    <div>
        <Navigation />

      <div className="mb-20 mt-40 max-w-6xl mx-auto">
        <b className="text-xl block mb-6">Terms of Use</b>

        <div className="mb-4">
          <b>1. Acceptance of Terms</b>
          <p>
           By accessing or using www.covehealthsolutions.com, you agree to comply with these Terms of Use. If you do not agree, please do not use our site.
            </p>
        </div>

        <div className="mb-4">
          <b>2. Use of Website</b>
          <ul className="list-disc mt-2 ms-10">
            <li>
              You agree to use this website for lawful purposes only.
            </li>
            <li>
              You may not engage in unauthorized data collection or distribute harmful content.
            </li>
           
          </ul>
        </div>

        <div className="mb-4">
          <b>3. Intellectual Property</b>
          <p>All content, logos, and trademarks on this site are owned by Cove Health and protected by intellectual property laws.</p>
          
        </div>

        <div className="mb-4">
          <b>4. Disclaimer of Warranties</b>
          <p>
           This website is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error-free service.
          </p>
         
        </div>

        <div className="mb-4">
          <b>5. Limitation</b>
          <p>
           Cove Health is not liable for any damages arising from your use of the website, including indirect or incidental damages.
          </p>
        </div>

        <div className="mb-4">
          <b>6. Governing law</b>
          <p>
           These Terms of Use are governed by the laws of the state of Nevada.
            </p>
        </div>

        <div className="mb-4">
          <b>7. Changes to Terms</b>
          <p>
          We may update these Terms periodically. Continued use of the site indicates acceptance of the revised Terms.
           </p>
        </div>

        <div className="mb-4">
          <b>8. Contact Information</b>
          <p>
           For any questions about these Terms, contact us at info@covehealthsolutions.com.
          </p>
        </div>
      </div>
      <Footer2 />

    </div>
  );
};

export default TermsAndConditions;
