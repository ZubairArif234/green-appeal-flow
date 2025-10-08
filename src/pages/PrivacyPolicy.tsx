import { Footer2 } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div>
        <Navigation />

      <div className="mb-20 mt-40 max-w-6xl mx-auto">
        <b className="text-xl block mb-6">Privacy policy</b>

        <div className="mb-4">
          <b>1. Introduction</b>
          <p>
            Cove Health ("Company," "we," "us," or "our") respects your privacy
            and is committed to protecting it through this Privacy Policy. This
            policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website www.covehealthsolutions.com.
          </p>
        </div>

        <div className="mb-4">
          <b>2. Information we collect</b>
          <ul className="list-disc mt-2 ms-10">
            <li>
              <b>Personal Information:</b>Name, email address, phone number, and
              other identifiers when voluntarily provided.
            </li>
            <li>
              <b>Non-Personal Information:</b>Browser type, IP address, and
              usage data.
            </li>
            <li>
              <b>Cookies and Tracking Technologies:</b>We use cookies to improve
              user experience and analyze website traffic.
            </li>
          </ul>
        </div>

        <div className="mb-4">
          <b>3. How We Use Your Information</b>
          <p>We use collected data to:</p>
          <ul className="list-disc mt-2 ms-10">
            <li>Provide and improve our services.</li>
            <li>Communicate with you about our offerings.</li>
            <li>Maintain website security.</li>
            <li>Comply with legal obligations.</li>
          </ul>
        </div>

        <div className="mb-4">
          <b>4. Sharing of Information</b>
          <p>
            We do not sell or rent your personal data. We may share information
            with:
          </p>
          <ul className="list-disc mt-2 ms-10">
            <li>Service providers assisting in website operation.</li>
            <li>Legal authorities when required by law.</li>
          </ul>
        </div>

        <div className="mb-4">
          <b>5. Data Security</b>
          <p>
            We implement industry-standard security measures to protect your
            information. However, no method of transmission is 100% secure.
          </p>
        </div>

        <div className="mb-4">
          <b>6. Your Rights</b>
          <p>
            Depending on your location, you may have rights to access, correct,
            or delete your personal data. Contact us at
            info@covehealthsolutions.com for requests.
          </p>
        </div>

        <div className="mb-4">
          <b>7. Changes to This Privacy Policy</b>
          <p>
            We may update this policy periodically. The effective date at the
            top will reflect the latest changes.
          </p>
        </div>

        <div className="mb-4">
          <b>8. Contact Information</b>
          <p>
            For any privacy-related inquiries, contact us at
            info@covehealthsolutions.com.
          </p>
        </div>
      </div>
      <Footer2 />

    </div>
  );
};

export default PrivacyPolicy;
