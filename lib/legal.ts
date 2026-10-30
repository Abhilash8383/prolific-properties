export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "h3"; text: string }
  | { type: "note"; text: string };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export const TERMS_UPDATED = "30 October 2026";
export const PRIVACY_UPDATED = "30 October 2026";

export const TERMS_INTRO = [
  "Welcome to Prolific Properties. These Terms & Conditions govern your access to and use of the Prolific Properties website, www.prolificproperties.in, and the services made available through it.",
  "By accessing or using this website, you acknowledge that you have read and understood these Terms & Conditions. If you do not agree with them, please discontinue using the website.",
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "about",
    title: "1. About Prolific Properties",
    blocks: [
      { type: "p", text: "Prolific Properties provides real estate information, property discovery assistance, consultation, and enquiry facilitation services to prospective property buyers and other interested individuals." },
      { type: "p", text: "We may showcase residential apartments, villas, duplexes, plots, and other real estate projects offered by third-party developers or property owners." },
      { type: "p", text: "Unless expressly stated otherwise, Prolific Properties does not own, construct, or directly develop the properties displayed on this website. Our role in a particular transaction may vary depending on the project and the relevant arrangement." },
    ],
  },
  {
    id: "use",
    title: "2. Use of the Website",
    blocks: [
      { type: "p", text: "You agree to use this website only for lawful purposes." },
      { type: "p", text: "You must not:" },
      {
        type: "ul",
        items: [
          "Submit false, misleading, or inaccurate information through any form.",
          "Use the website for fraudulent, unlawful, or unauthorised activities.",
          "Attempt to gain unauthorised access to the website or its systems.",
          "Copy, reproduce, distribute, or commercially exploit website content without prior authorisation.",
          "Interfere with the website's functionality, security, or availability.",
          "Use automated tools to extract website data without permission.",
        ],
      },
      { type: "p", text: "We reserve the right to restrict or suspend access where we reasonably believe these Terms & Conditions have been violated." },
    ],
  },
  {
    id: "accuracy",
    title: "3. Property Information and Accuracy",
    blocks: [
      { type: "p", text: "We make reasonable efforts to present property information accurately and clearly. However, property details may be supplied by developers, owners, or other third parties and may change over time." },
      { type: "p", text: "Information displayed on this website may include:" },
      {
        type: "ul",
        items: [
          "Project names and descriptions.",
          "Property locations and configurations.",
          "Prices and payment plans.",
          "Amenities and facilities.",
          "Construction status and possession timelines.",
          "Project approvals and registration details.",
          "Photographs, illustrations, floor plans, and architectural renders.",
        ],
      },
      { type: "p", text: "Unless expressly confirmed in writing by the relevant authorised party, this information should be treated as indicative and subject to verification." },
      { type: "p", text: "Prospective buyers should independently verify all material details with the developer, owner, or other authorised representative before making a purchase decision." },
    ],
  },
  {
    id: "prices",
    title: "4. Property Prices, Offers, and Availability",
    blocks: [
      { type: "p", text: "Property prices, availability, discounts, payment schedules, and promotional offers may change without prior notice." },
      { type: "p", text: "Prices displayed on the website may be indicative and may exclude applicable taxes, registration charges, stamp duty, maintenance deposits, parking charges, club membership fees, or other costs, unless expressly stated otherwise." },
      { type: "p", text: "The final price and applicable charges must be confirmed with the relevant developer or authorised seller." },
      { type: "p", text: "An enquiry, site visit, or expression of interest does not guarantee that a property will remain available or that a quoted price or offer will be honoured." },
      { type: "p", text: "Any booking, allotment, or purchase will be subject to the applicable written documents and the terms agreed with the relevant developer or seller." },
    ],
  },
  {
    id: "third-party",
    title: "5. Third-Party Developers and Projects",
    blocks: [
      { type: "p", text: "Prolific Properties may feature projects developed, marketed, or sold by third-party developers, builders, property owners, and other service providers." },
      { type: "p", text: "We do not automatically assume responsibility for the construction quality, project completion, delivery timelines, amenities, title, approvals, or contractual obligations of such third parties." },
      { type: "p", text: "Nothing in this clause excludes any responsibility that Prolific Properties may have under applicable law or under a specific agreement." },
      { type: "p", text: "Before committing to a property, buyers should review the relevant project documents, approvals, applicable registration details, payment terms, and sale or allotment agreements." },
    ],
  },
  {
    id: "enquiries",
    title: "6. Property Enquiries and Consultation",
    blocks: [
      { type: "p", text: "Visitors may submit enquiries through website forms, telephone calls, email, WhatsApp, or other available communication channels." },
      { type: "p", text: "By submitting an enquiry, you confirm that the information you provide is accurate to the best of your knowledge." },
      { type: "p", text: "Submitting an enquiry does not create a binding agreement to purchase a property or engage our services." },
      { type: "p", text: "We will make reasonable efforts to respond to enquiries. However, response times may vary depending on availability, working hours, and enquiry volume. We do not guarantee that every enquiry will result in a transaction or that a particular property will meet your requirements." },
    ],
  },
  {
    id: "site-visits",
    title: "7. Site Visits and Property Inspections",
    blocks: [
      { type: "p", text: "Site visits may be arranged subject to availability and confirmation by the relevant developer, owner, or authorised representative." },
      { type: "p", text: "Visitors are responsible for following applicable site rules and safety instructions during a visit." },
      { type: "p", text: "A site visit does not constitute an independent technical, structural, legal, financial, or title assessment of the property." },
      { type: "p", text: "Prospective buyers are encouraged to conduct appropriate inspections and obtain professional advice before entering into a transaction." },
    ],
  },
  {
    id: "investment",
    title: "8. No Guarantee of Investment Returns",
    blocks: [
      { type: "p", text: "Property prices and real estate market conditions may fluctuate." },
      { type: "p", text: "Any information about investment potential, rental income, appreciation, future infrastructure, or expected returns is provided for general informational purposes unless expressly supported by a binding written commitment from an authorised party." },
      { type: "p", text: "Prolific Properties does not guarantee capital appreciation, rental returns, resale value, or any particular financial outcome." },
      { type: "p", text: "Visitors should assess their own financial circumstances and seek independent professional advice where appropriate." },
    ],
  },
  {
    id: "approvals",
    title: "9. Project Approvals and Regulatory Information",
    blocks: [
      { type: "p", text: "Where applicable, project registration numbers, approval details, and related regulatory information may be displayed on the website." },
      { type: "p", text: "Such information is provided to help visitors identify and evaluate projects. Visitors should verify the current status and authenticity of relevant records through the appropriate official authorities before making a purchase decision." },
      { type: "p", text: "The display of a registration number or approval reference should not be interpreted as a guarantee of construction quality, completion, investment performance, or legal suitability for every buyer." },
      { type: "p", text: "Nothing in these Terms & Conditions limits any rights or remedies available to consumers under applicable law." },
    ],
  },
  {
    id: "ip",
    title: "10. Intellectual Property",
    blocks: [
      { type: "p", text: "Unless otherwise indicated, the website's original text, branding, logos, graphics, layout, and other original materials are owned by Prolific Properties or used with permission." },
      { type: "p", text: "Third-party trademarks, developer names, project names, photographs, and other materials remain the property of their respective owners." },
      { type: "p", text: "You may view and use the website for personal, non-commercial purposes. You must not reproduce, modify, publish, distribute, or commercially exploit protected content without the relevant permission, except where permitted by law." },
    ],
  },
  {
    id: "links",
    title: "11. Third-Party Websites and Services",
    blocks: [
      { type: "p", text: "Our website may contain links to third-party websites, developer websites, map services, messaging platforms, or other external services." },
      { type: "p", text: "These services operate independently and may have their own terms, privacy policies, and practices." },
      { type: "p", text: "Prolific Properties does not control external websites and is not responsible for their content, availability, security, or privacy practices. This does not exclude responsibility imposed by applicable law." },
      { type: "p", text: "Visitors should review the relevant third-party terms and privacy policies before using those services." },
    ],
  },
  {
    id: "privacy",
    title: "12. Privacy and Personal Information",
    blocks: [
      { type: "p", text: "When you contact us or submit an enquiry, we may collect information such as your name, telephone number, email address, property preferences, and other information you choose to provide." },
      { type: "p", text: "We will handle personal information in accordance with our Privacy Policy and applicable data protection laws." },
      { type: "p", text: "Your contact information may be used to respond to enquiries, provide requested property information, coordinate site visits, and communicate about relevant services. Marketing communications will be handled in accordance with applicable consent and communication requirements." },
      { type: "p", text: "Please refer to our Privacy Policy for further details about the information we collect, how we use it, and the choices available to you." },
    ],
  },
  {
    id: "availability",
    title: "13. Website Availability and Disclaimer",
    blocks: [
      { type: "p", text: "We endeavour to keep the website accessible and its information reasonably up to date. However, we do not guarantee uninterrupted availability, error-free operation, or the absence of technical issues." },
      { type: "p", text: "Website content is provided for general informational purposes. To the extent permitted by applicable law, we disclaim implied warranties that are not required by law." },
      { type: "p", text: "Nothing in these Terms & Conditions excludes or restricts liability where such exclusion or restriction is prohibited by applicable law." },
    ],
  },
  {
    id: "liability",
    title: "14. Limitation of Liability",
    blocks: [
      { type: "p", text: "To the extent permitted by applicable law, Prolific Properties will not be liable for indirect or consequential losses arising from the use of, or inability to use, the website." },
      { type: "p", text: "We are not responsible for losses arising solely from inaccurate or outdated third-party property information that could not reasonably have been identified or corrected by us, or from independent acts or omissions of third-party developers or sellers." },
      { type: "p", text: "This clause does not exclude liability for fraud, wilful misconduct, negligence where liability cannot lawfully be excluded, breach of an applicable contractual obligation, or any other liability that cannot be limited under applicable law." },
    ],
  },
  {
    id: "indemnity",
    title: "15. Indemnity",
    blocks: [
      { type: "p", text: "To the extent permitted by law, you agree to be responsible for losses, claims, or reasonable costs arising directly from your unlawful use of the website, your material breach of these Terms & Conditions, or your infringement of another person's rights." },
      { type: "p", text: "This provision does not require you to indemnify Prolific Properties for losses caused by our own unlawful conduct or for liabilities that cannot lawfully be transferred to you." },
    ],
  },
  {
    id: "changes",
    title: "16. Changes to These Terms",
    blocks: [
      { type: "p", text: "We may revise these Terms & Conditions from time to time to reflect changes in our services, website features, business practices, or applicable legal requirements." },
      { type: "p", text: "Updated terms will be published on this page with a revised “Last Updated” date." },
      { type: "p", text: "Your continued use of the website after the updated terms are published will be subject to applicable law and the revised terms." },
    ],
  },
  {
    id: "law",
    title: "17. Governing Law and Jurisdiction",
    blocks: [
      { type: "p", text: "These Terms & Conditions are governed by the laws of India." },
      { type: "p", text: "Subject to applicable law, courts of competent jurisdiction in Bhubaneswar, Odisha, shall have jurisdiction over disputes arising from the use of this website." },
      { type: "p", text: "Nothing in this clause limits any statutory rights or remedies available to consumers under applicable law." },
    ],
  },
  {
    id: "contact",
    title: "18. Contact Information",
    blocks: [
      { type: "p", text: "If you have questions about these Terms & Conditions, please contact us using the details below." },
      { type: "note", text: "By using this website, you acknowledge that you have read these Terms & Conditions." },
    ],
  },
];

export const PRIVACY_INTRO = [
  "Welcome to Prolific Properties.",
  "At Prolific Properties, we respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy explains how we collect, use, store, disclose, and protect your information when you visit our website, www.prolificproperties.in, contact us, or use our property-related services.",
  "By accessing our website or providing your personal information, you acknowledge that you have read this Privacy Policy. Where consent is required under applicable law, we will seek it through appropriate means.",
];

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "about",
    title: "1. About Prolific Properties",
    blocks: [
      { type: "p", text: "Prolific Properties provides property discovery, real estate consultation, property enquiry facilitation, and related services." },
      { type: "p", text: "We help prospective buyers explore residential properties and projects offered by various developers and property owners, primarily in Bhubaneswar and other relevant locations in Odisha." },
      { type: "p", text: "For questions about this Privacy Policy or our handling of personal information, please contact us using the details provided at the end of this page." },
    ],
  },
  {
    id: "collect",
    title: "2. Information We Collect",
    blocks: [
      { type: "p", text: "We may collect the following categories of information, depending on how you interact with our website and services." },
      { type: "h3", text: "A. Personal Information" },
      { type: "p", text: "When you submit an enquiry, request a callback, or contact us, we may collect:" },
      {
        type: "ul",
        items: [
          "Full name.",
          "Mobile number.",
          "Email address.",
          "Preferred property location.",
          "Preferred property type, such as an apartment, villa, duplex, or plot.",
          "Budget range and property requirements.",
          "Preferred time or method of contact.",
          "Any other information you voluntarily provide.",
        ],
      },
      { type: "p", text: "Please avoid sharing sensitive personal information unless it is genuinely necessary for a specific service." },
      { type: "h3", text: "B. Technical and Usage Information" },
      { type: "p", text: "When you visit our website, certain technical information may be collected automatically, depending on the website configuration and technologies in use." },
      { type: "p", text: "This may include:" },
      {
        type: "ul",
        items: [
          "IP address.",
          "Browser type and version.",
          "Device and operating system information.",
          "Pages visited and interactions with website features.",
          "Referral source and approximate location derived from technical information.",
          "Date, time, and duration of visits.",
        ],
      },
      { type: "h3", text: "C. Cookies and Similar Technologies" },
      { type: "p", text: "Our website may use cookies or similar technologies to support essential website functionality, understand website traffic, improve user experience, and measure marketing performance." },
      { type: "p", text: "The specific technologies used will depend on the services enabled on our website." },
      { type: "p", text: "You can manage cookies through your browser settings and, where provided, our website's cookie preferences. Disabling certain cookies may affect website functionality." },
    ],
  },
  {
    id: "use",
    title: "3. How We Use Your Information",
    blocks: [
      { type: "p", text: "We may use your personal information for the following purposes:" },
      {
        type: "ol",
        items: [
          "Responding to enquiries: To answer your questions about properties, projects, prices, and availability.",
          "Property recommendations: To suggest properties based on your stated budget, location, and preferences.",
          "Site visit coordination: To arrange property visits with relevant developers, owners, or authorised representatives.",
          "Customer communication: To provide requested updates about enquiries, bookings, or services.",
          "Service improvement: To understand customer requirements and improve our website and services.",
          "Marketing communications: To share relevant property information, project launches, offers, and updates where permitted by applicable law and based on the required consent or other lawful basis.",
          "Website analytics: To measure website performance, understand visitor behaviour, and improve our marketing activities.",
          "Security and fraud prevention: To protect our website, users, and business from misuse, fraudulent activity, and security threats.",
          "Legal compliance: To comply with applicable laws, lawful requests, and legitimate legal obligations.",
        ],
      },
      { type: "p", text: "We will not knowingly use your personal information for purposes that are incompatible with the purposes explained in this Privacy Policy without an appropriate lawful basis." },
    ],
  },
  {
    id: "sharing",
    title: "4. Sharing of Information with Developers and Service Providers",
    blocks: [
      { type: "p", text: "To help you explore a property or complete a requested service, we may share relevant information with selected third parties." },
      { type: "p", text: "These may include:" },
      { type: "h3", text: "A. Property Developers and Owners" },
      { type: "p", text: "If you enquire about a particular project, we may share relevant details, such as your name, contact information, and property preferences, with the relevant developer, owner, or authorised sales representative so that they can respond to your enquiry or coordinate a site visit." },
      { type: "p", text: "Where required, we will obtain your consent before sharing your information for this purpose." },
      { type: "h3", text: "B. Website and Technology Providers" },
      { type: "p", text: "We may use third-party providers for website hosting, customer relationship management, analytics, communication, security, and related technical services." },
      { type: "p", text: "These providers may process information on our behalf to deliver their services, subject to applicable contractual and legal requirements." },
      { type: "h3", text: "C. Communication Platforms" },
      { type: "p", text: "If you contact us through WhatsApp, telephone, email, or another communication platform, your information may be processed by the relevant service provider according to its own privacy practices." },
      { type: "h3", text: "D. Legal and Regulatory Authorities" },
      { type: "p", text: "We may disclose information where required by law, a valid legal process, or a lawful request from a competent authority." },
      { type: "h3", text: "E. Business Transfers" },
      { type: "p", text: "If our business undergoes a merger, restructuring, acquisition, or transfer of assets, personal information may be transferred where legally permitted and subject to appropriate safeguards." },
      { type: "note", text: "We do not sell your personal information to third parties as a standalone commercial product." },
      { type: "p", text: "We will limit information sharing to what is reasonably necessary for the relevant purpose, subject to applicable law." },
    ],
  },
  {
    id: "communications",
    title: "5. Calls, WhatsApp, SMS, and Email Communications",
    blocks: [
      { type: "p", text: "When you provide your contact details, we may use them to respond to your property enquiry and provide information you have requested." },
      { type: "p", text: "Where permitted by applicable law and where the required consent or other lawful basis exists, we may also contact you about:" },
      {
        type: "ul",
        items: [
          "New property launches.",
          "Project availability and updates.",
          "Relevant property offers.",
          "Site visits and consultations.",
          "Other real estate services offered by Prolific Properties.",
        ],
      },
      { type: "p", text: "You may opt out of promotional communications at any time by using an available unsubscribe mechanism or contacting us directly." },
      { type: "p", text: "Opting out of marketing messages will not necessarily prevent us from sending essential communications relating to an existing enquiry or service, where such communications are legally permitted." },
      { type: "p", text: "We will respect applicable consent requirements, communication preferences, and restrictions on promotional communications." },
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies, Analytics, and Advertising",
    blocks: [
      { type: "p", text: "We may use analytics and advertising tools to understand website traffic and evaluate the performance of our marketing campaigns." },
      { type: "p", text: "Depending on our website configuration, these may include services such as Google Analytics, Google Ads conversion measurement, or Meta advertising technologies." },
      { type: "p", text: "Such tools may collect technical information about website visits and interactions." },
      { type: "p", text: "Where required by applicable law, we will obtain consent before using non-essential cookies or similar tracking technologies." },
      { type: "p", text: "You may also be able to manage certain data collection preferences through the relevant third-party service providers." },
      { type: "p", text: "We will update this Privacy Policy if our use of analytics, advertising, or tracking technologies materially changes." },
    ],
  },
  {
    id: "security",
    title: "7. Data Storage and Security",
    blocks: [
      { type: "p", text: "We take reasonable technical and organisational measures designed to protect personal information against unauthorised access, disclosure, alteration, loss, or misuse." },
      { type: "p", text: "Depending on the systems used, information may be stored in website databases, business communication systems, customer relationship management platforms, email services, or other authorised systems." },
      { type: "p", text: "Access to personal information should be limited to personnel and service providers who need it for legitimate business purposes." },
      { type: "p", text: "However, no method of electronic transmission or storage is completely secure. We cannot guarantee absolute security, but we will take appropriate steps to protect information in accordance with applicable law." },
    ],
  },
  {
    id: "retention",
    title: "8. Data Retention",
    blocks: [
      { type: "p", text: "We retain personal information only for as long as reasonably necessary to fulfil the purposes for which it was collected, including responding to enquiries, providing services, maintaining relevant business records, resolving disputes, and complying with legal obligations." },
      { type: "p", text: "Retention periods may vary depending on the nature of the information and the relevant purpose." },
      { type: "p", text: "When information is no longer required, we will take reasonable steps to delete it, anonymise it, or otherwise dispose of it securely, subject to applicable legal requirements." },
    ],
  },
  {
    id: "rights",
    title: "9. Your Privacy Rights and Choices",
    blocks: [
      { type: "p", text: "Subject to applicable law, you may have the right to:" },
      {
        type: "ul",
        items: [
          "Request information about the personal data we process about you.",
          "Request correction or updating of inaccurate personal information.",
          "Request deletion of personal information where legally applicable.",
          "Withdraw consent where processing is based on your consent.",
          "Opt out of promotional communications.",
          "Raise a concern or grievance about how your personal information is handled.",
          "Exercise any additional rights available under applicable data protection laws.",
        ],
      },
      { type: "p", text: "To make a request, contact us using the details provided in the Contact Us section." },
      { type: "p", text: "We may need to verify your identity before acting on a request. Certain information may need to be retained where required by law or where another lawful basis applies." },
      { type: "p", text: "We will respond to requests within the timeframes prescribed by applicable law." },
    ],
  },
  {
    id: "third-party",
    title: "10. Third-Party Websites and Services",
    blocks: [
      { type: "p", text: "Our website may contain links to external websites, including developer websites, property portals, maps, and messaging platforms." },
      { type: "p", text: "We do not control the privacy practices of these external websites." },
      { type: "p", text: "When you visit a third-party website or use its services, its own terms and privacy policy will apply. We encourage you to review those policies before providing personal information." },
    ],
  },
  {
    id: "children",
    title: "11. Children's Privacy",
    blocks: [
      { type: "p", text: "Our website and property-related services are intended for individuals who are legally capable of using them." },
      { type: "p", text: "We do not knowingly seek to collect personal information from children in circumstances where doing so would be inappropriate or unlawful." },
      { type: "p", text: "If you believe that a child has provided personal information to us inappropriately, please contact us so that we can assess the matter and take appropriate action in accordance with applicable law." },
    ],
  },
  {
    id: "international",
    title: "12. International Data Processing",
    blocks: [
      { type: "p", text: "Some third-party technology or communication providers may store or process information on servers located outside your state or country." },
      { type: "p", text: "Where personal information is transferred or processed across borders, we will take steps to comply with applicable legal requirements and implement appropriate safeguards where required." },
    ],
  },
  {
    id: "changes",
    title: "13. Changes to This Privacy Policy",
    blocks: [
      { type: "p", text: "We may update this Privacy Policy from time to time to reflect changes in our business, website features, technology providers, or applicable legal requirements." },
      { type: "p", text: "The revised version will be published on this page with an updated “Last Updated” date." },
      { type: "p", text: "We encourage visitors to review this page periodically to remain informed about how we handle personal information." },
      { type: "p", text: "Where required by applicable law, we will provide additional notice or seek consent for material changes." },
    ],
  },
  {
    id: "law",
    title: "14. Applicable Law",
    blocks: [
      { type: "p", text: "This Privacy Policy will be interpreted in accordance with the applicable laws of India, including relevant data protection and information technology laws, as amended from time to time." },
      { type: "p", text: "Nothing in this Privacy Policy is intended to restrict any privacy rights or remedies available to individuals under applicable law." },
    ],
  },
  {
    id: "contact",
    title: "15. Contact Us",
    blocks: [
      { type: "p", text: "If you have questions, requests, or concerns about this Privacy Policy or the handling of your personal information, please contact us." },
      { type: "p", text: "Privacy-related requests: Please use the contact details below and mention “Privacy Request” in your communication so that we can identify and direct your request appropriately." },
      { type: "note", text: "By using our website, you acknowledge that you have had the opportunity to review this Privacy Policy." },
    ],
  },
];
