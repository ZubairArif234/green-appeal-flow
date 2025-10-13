import { Footer2 } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import React from "react";

const TermsAndConditions = () => {
  return (
    <div>
        <Navigation />

      <div className="mb-20 mt-40 max-w-6xl mx-auto">
        <b className="text-2xl block mb-6">Terms of Use</b>

<p className="mb-4">
By accessing or using the Cove Health’s Denial Analyzer ("the Service"), you 
agree to be bound by these Terms of Service ("Terms"). If you do not agree 
to these Terms, you may not use the Service. Your use of the Service also 
constitutes acceptance of our Privacy Policy and all applicable laws and 
regulations
</p>
        <div className="mb-4">
          <b>1. Purpose of the Service</b>
          <p className="mb-2">
           Cove Health’s Denial Analyzer is a tool designed to help users analyze 
medical claim denial information and generate general insights and 
recommendations based on input data. It uses AI and automated processes 
to assist in identifying possible reasons for denials and offering suggestions 
that may help users improve claim resubmissions.
            </p>
          <p>
           This tool is for informational and administrative purposes only. It is not a 
billing service, does not directly submit claims, and does not guarantee 
payment, reimbursement, appeal success, or specific outcomes. You use the 
Service at your own discretion and risk.
            </p>
        </div>

        <div className="mb-4">
          <b>2. No Protected Health Information (PHI)</b>
          
          <p className="mb-2">
           You agree not to upload, transmit, or otherwise submit any Protected Health 
Information (PHI) as defined under the Health Insurance Portability and 
Accountability Act of 1996 (HIPAA) when using the Service.
            </p>
          <p className="mb-2">
          By using this tool, you acknowledge and agree that:
            </p>

          <ul className="list-disc mt-2 ms-10">
            <li>
             All data you upload must be fully de-identified and free of any PHI, 
including patient names, dates of birth, medical record numbers, or 
any other individually identifiable health information.
            </li>
            <li>
              You are solely responsible for ensuring that any information shared 
complies with HIPAA and all applicable privacy regulations.
            </li>
            <li>
             Cove Health, its affiliates, and the Denial Analyzer tool are not 
responsible for any HIPAA violations or security breaches that result 
from your failure to properly redact or de-identify information.
            </li>
           
          </ul>

          <p className="mb-2">
         Cove Health is not a Business Associate under HIPAA in connection with your 
use of this Service unless we enter into a separate written Business 
Associate Agreement (BAA)
            </p>
        </div>

        <div className="mb-4">
          <b>3. User Responsibility</b>
          <p className="mb-2">You agree that:</p>
          
           <ul className="list-disc mt-2 ms-10">
            <li>
             You are responsible for the accuracy, legality, and appropriateness of 
any data or content you submit.
            </li>
            <li>
              You will not use the Service for any unlawful or fraudulent purpose.
            </li>
            <li>
             You will not attempt to reverse engineer, decompile, or otherwise 
interfere with the Service or its underlying technology.
            </li>
           
          </ul>

        </div>

        <div className="mb-4">
          <b>4. No Guarantees or Warranties</b>
        <p className="mb-2">
       The insights and recommendations provided by the Denial Analyzer are for 
informational purposes only. While we aim to provide helpful and accurate 
suggestions, we make no representations or warranties of any kind, express 
or implied, about:
            </p>

             <ul className="list-disc mt-2 ms-10">
            <li>
           The accuracy or completeness of the results.
            </li>
            <li>
             The likelihood of claim reimbursement, appeal approval, or payment.
            </li>
            <li>
             The effectiveness of any actions taken based on the tool’s output.
            </li>
           
          </ul>
         
         <p className="mb-2">
       Use of the Service does not guarantee results. You remain solely responsible 
for your billing, appeals, and payer interactions.
            </p>

        </div>

        <div className="mb-4">
          <b>5. Data Use and Privacy</b>
          <p className="mb-2">Cove Health does not intentionally store or retain user-submitted input 
data, including uploaded denial information, screenshots, or written 
descriptions. All inputs are processed in real-time and routed through third-
party AI providers via secure API connections.</p>
          <p className="mb-2">By using the Service, you understand and agree that:</p>
          
            <ul className="list-disc mt-2 ms-10">
            <li>
             Your inputs may be processed by third-party AI providers (e.g., 
language models) to generate analysis and recommendations.
            </li>
            <li>
              Cove Health does not access, store, or retain input data after it is 
transmitted to the AI provider, unless specifically disclosed or agreed 
upon.
            </li>
            <li>
            You remain fully responsible for ensuring that any data submitted is 
fully de-identified and free of PHI or other sensitive information.
            </li>
           
          </ul>

  <p className="mb-2">We may store and analyze the outputs generated by the Service (i.e., the AI-
generated insights or recommendations) for purposes such as improving 
product performance, refining algorithms, and tracking usage trends. These 
outputs do not contain user-identifiable information and may be used 
internally without restriction, subject only to applicable law.</p>
  <p className="mb-2">We recommend you review the privacy policies of any third-party platforms 
integrated into the Service for details on their data handling practices.</p>
  <p className="mb-2">For more information, see our Privacy Policy.</p>
          

        </div>

        <div className="mb-4">
          <b>6. Service Availability</b>
          <p>
           We reserve the right to suspend, modify, or discontinue the Service at any 
time without notice. We are not liable for any loss or disruption resulting 
from such actions.
            </p>
        </div>

        <div className="mb-4">
          <b>7. Limitation of Liability</b>
          <p>
          To the fullest extent permitted by law, Cove Health shall not be liable for any
indirect, incidental, special, consequential, or punitive damages arising from 
or related to your use of the Service, including but not limited to:
           </p>

            <ul className="list-disc mt-2 ms-10">
            <li>
           Loss of revenue
            </li>
            <li>
             Claim denials
            </li>
            <li>
          Payment delays
          </li>
            <li>
          Regulatory penalties
          </li>
            <li>
          Data breaches resulting from user input errors
          </li>
           
          </ul>
        </div>

        <div className="mb-4">
          <b>8. Indemnification</b>
          <p>
          You agree to indemnify and hold harmless Cove Health, its officers, 
employees, contractors, and affiliates from any claims, liabilities, damages, 
or expenses (including legal fees) arising out of
          </p>

           <ul className="list-disc mt-2 ms-10">
            <li>
           Your use of the Service
            </li>
            <li>
             Your failure to comply with these Terms
            </li>
            <li>
          Any data you submit, including PHI or otherwise sensitive information
          </li>
           
          </ul>
        </div>

         <div className="mb-4">
          <b>9. Modifications</b>
          <p>
          We may update these Terms at any time. Continued use of the Service after 
changes are posted constitutes acceptance of the updated Terms.
            </p>
        </div>

         <div className="mb-4">
          <b>10. Governing Law</b>
          <p>
          These Terms are governed by the laws of the State of Nevada, without 
regard to its conflict of law principles. Any legal action or proceeding relating
to the use of this Service shall be brought exclusively in a court of competent
jurisdiction located in Clark County, Nevada
           </p>
        </div>

         <div className="mb-4">
          <b>10. Contact</b>
          <p>
         Questions about these Terms? Email us at  </p>
         <b>
info@covehealthsolutions.com.</b>
        </div>
      </div>
      <Footer2 />

    </div>
  );
};

export default TermsAndConditions;
