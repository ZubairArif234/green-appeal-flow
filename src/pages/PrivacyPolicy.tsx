import { Footer2 } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import React, { useEffect } from "react";

const PrivacyPolicy = () => {

  useEffect(() => {
    window.scrollTo(0,0)

  }, []);
  return (
    <div>
        <Navigation />

      <div className="mb-20 px-4 mt-40 max-w-6xl mx-auto">
        <b className="text-2xl block mb-6">Privacy Policy</b>

        <p className="mb-4"><b>Effective Date: October 1, 2025</b></p>

        <p className="mb-4">
This Privacy Policy explains how Cove Health ("we," "our," or "us") collects, 
uses, shares, and protects information in connection with our Denial Analyzer
tool ("the Service").
        </p>
        <p className="mb-4">
By using the Service, you agree to the practices described here and to our 
Terms of Service If you do not agree, do not use the Service.
        </p>

        <div className="mb-4">
          <b>1. No PHI Permitted – Your Responsibility</b>
          <p className="mb-2">
This Service is not intended to process, store, or receive Protected Health 
Information ("PHI") as defined under HIPAA.
          </p>
          <p className="mb-2">You agree:</p>

          <ul className="list-disc mt-2 ms-10">
            <li>
Not to submit, upload, or transmit any PHI or identifiable patient 
information.
            </li>
            <li>
To fully de-identify any data prior to use.
            </li>
            <li>
That Cove Health has no responsibility for identifying or filtering PHI 
submitted in violation of this policy.
            </li>
          </ul>

          <p className="mb-2">
Cove Health is not a Business Associate under HIPAA unless we've signed a 
separate written Business Associate Agreement (BAA) with you.
          </p>

          <p className="mb-2">
If you submit PHI in violation of these terms, you assume full responsibility, 
including any resulting legal or regulatory exposure.
          </p>
        </div>

        <div className="mb-4">
          <b>2. Types of Information We May Collect</b>
          <p className="mb-2">
We may collect and process the following types of information in connection 
with the Service:
          </p>

          <ul className="list-disc mt-2 ms-10">
            <li>Account Information (name, email, login credentials, etc.)</li>
            <li>Usage Information (e.g., IP address, browser type, device identifiers, 
activity logs, time spent)</li>
            <li>Submission Metadata (e.g., file types, timestamps, API activity)</li>
            <li>Output Data – generated results, insights, recommendations, or 
analysis returned by the Service</li>
            <li>Aggregated or Derived Data created by us from any of the above</li>
          </ul>

          <p className="mb-2">
We do not intentionally collect or store input data submitted through the 
Denial Analyzer unless otherwise disclosed or agreed upon. However, once 
data is processed and returned as output, that output may be stored, 
analyzed, or used by us without restriction, provided it does not contain PHI.
          </p>
        </div>

        <div className="mb-4">
          <b>3. How We Use Information</b>
          <p className="mb-2">
We may use any information collected or derived through the Service—
including outputs—for any lawful purpose, including but not limited to:
          </p>
          <ul className="list-disc mt-2 ms-10">
            <li>Operating, maintaining, and improving the Service</li>
            <li>Research and development</li>
            <li>Product analytics and performance optimization</li>
            <li>Internal auditing and data modeling</li>
            <li>Marketing, benchmarking, or case studies (in anonymized or 
aggregated formats)</li>
            <li>Compliance, legal, or business operations</li>
          </ul>
          <p className="mb-2">
We reserve the right to analyze, retain, modify, reproduce, and use any 
output data and associated usage patterns, in perpetuity, for any purpose, 
subject only to applicable laws and the exclusion of PHI.
          </p>
        </div>

        <div className="mb-4">
          <b>4. Third-Party Providers and AI Processing</b>
          <p className="mb-2">
The Service uses third-party AI technologies and APIs to process input and 
generate outputs. By using the Service, you acknowledge and agree that:
          </p>
          <ul className="list-disc mt-2 ms-10">
            <li>Your inputs may be transmitted to external AI platforms or 
infrastructure providers.</li>
            <li>We do not guarantee or control how third-party providers handle or 
retain data.</li>
            <li>You are solely responsible for ensuring input data is compliant with 
your internal policies and legal obligations.</li>
          </ul>
          <p className="mb-2">
We choose providers that implement strong security practices, but you 
accept all risks associated with third-party processing.
          </p>
        </div>

        <div className="mb-4">
          <b>5. Data Retention</b>
          <p className="mb-2">We retain:</p>

          <ul className="list-disc mt-2 ms-10">
            <li>Account information while your account is active (and longer if needed 
to comply with legal or operational requirements).</li>
            <li>Output data, aggregated insights, and performance data for internal 
use and improvement.</li>
            <li>Usage logs and diagnostic data to maintain and secure the Service.</li>
          </ul>
          <p className="mb-2">
We do not retain raw input data submitted through the Service for 
processing—unless specifically disclosed otherwise or required for 
operational troubleshooting or abuse prevention.
          </p>
        </div>

        <div className="mb-4">
          <b>6. Security</b>
          <p>
We use industry-standard technical and organizational measures to protect 
the information we store. However, no system is completely secure. You use 
the Service at your own risk, and you are responsible for safeguarding any 
data you handle prior to submission.
          </p>
        </div>

        <div className="mb-4">
          <b>7. Your Choices and Rights</b>
          <p className="mb-2">
You may request deletion of your account or related personal information at 
any time by contacting info@covehealthsolutions.com. We reserve the 
right to retain anonymized or aggregated data, including outputs, even after 
account deletion.
          </p>
          <p className="mb-2">
Depending on your location, you may have additional rights under data 
protection laws (e.g., GDPR, CCPA). Contact us to exercise those rights.
          </p>
        </div>

        <div className="mb-4">
          <b>8. Children's Privacy</b>
          <p>
The Service is not intended for children under 18. We do not knowingly 
collect personal information from children. If we become aware of such 
information, we will delete it
          </p>
        </div>

        <div className="mb-4">
          <b>9. Changes to This Policy</b>
          <p className="mb-2">
We may update this Privacy Policy at any time. If we make material changes,
we may notify you via the Service or by email. Updated policies will always 
be posted here with the most recent revision date.
          </p>
          <p className="mb-2">
Continued use of the Service after changes are posted constitutes 
acceptance of the revised policy.
          </p>
        </div>

        <div className="mb-4">
          <b>10. Contact Us</b>
          <p>
If you have questions or concerns about this Privacy Policy or how we handle 
data, contact us at:
          </p>
          <b>info@covehealthsolutions.com</b>
        </div>
      </div>
      <Footer2 />

    </div>
  );
};

export default PrivacyPolicy;
