import { PhishingScenario } from './types';

export const phishingScenarios: PhishingScenario[] = [
  {
    id: '1',
    type: 'phishing',
    sender: {
      name: 'LAUTECH ICT Center',
      email: 'ict@lautech-portal.xyz'
    },
    subject: 'URGENT: Student Portal Migration - Verify Your Login',
    body: `Dear Student,

Following the recent upgrade of the LAUTECH student portal, all students are required to verify their login credentials within 24 hours to avoid losing access to course registration, results, and hostel allocation.

Click the link below to verify your LAUTECH student account immediately.

Failure to comply will result in automatic deactivation of your portal access.

Best regards,
LAUTECH ICT Center`,
    hasLink: true,
    linkText: 'Verify Portal Account',
    linkUrl: 'http://lautech-portal.xyz/verify',
    redFlags: ['Suspicious domain (.xyz not lautech.edu.ng)', 'Urgency tactics', 'Threat of account deactivation', 'Generic greeting'],
    explanation: 'This is phishing. LAUTECH official communications come from lautech.edu.ng, not lautech-portal.xyz. The university ICT center would never ask you to verify credentials via email link.'
  },
  {
    id: '2',
    type: 'legitimate',
    sender: {
      name: 'LAUTECH Registrar',
      email: 'registrar@lautech.edu.ng'
    },
    subject: 'Reminder: Course Registration Deadline for 2025/2026 Session',
    body: `Dear Students,

This is to remind all students that the course registration deadline for the 2025/2026 academic session is Friday, March 21st.

Please log into the student portal at portal.lautech.edu.ng to complete your course registration. Late registration will attract a penalty fee as approved by Senate.

For assistance, visit the ICT Center at the Main Campus or call 08031234567.

Registrar's Office
Ladoke Akintola University of Technology, Ogbomoso`,
    redFlags: [],
    explanation: 'This is legitimate. It uses the official lautech.edu.ng domain, provides specific dates, references the official portal URL, and includes verifiable contact information.'
  },
  {
    id: '3',
    type: 'phishing',
    sender: {
      name: 'LAUTECH Bursary',
      email: 'bursary@lautech-fees.com'
    },
    subject: 'School Fees Payment Reversal - Action Required',
    body: `Dear Student,

Our system detected that your school fees payment of ₦150,000 for the 2025/2026 session was reversed by your bank. Your registration has been flagged for cancellation.

To prevent losing your admission and registered courses, please re-verify your payment by clicking the link below within 12 hours.

You will need to provide your bank details for instant verification.

LAUTECH Bursary Department`,
    hasLink: true,
    linkText: 'Re-verify Payment Now',
    linkUrl: 'http://lautech-fees.com/verify-payment',
    redFlags: ['Fake domain (lautech-fees.com)', 'Requesting bank details', '12-hour deadline pressure', 'Payment reversal scare'],
    explanation: 'This is phishing. LAUTECH uses lautech.edu.ng for official communications. The Bursary would never ask for bank details via email. Payment issues are resolved at the Bursary office in person.'
  },
  {
    id: '4',
    type: 'phishing',
    sender: {
      name: 'LAUTECH Senate',
      email: 'senate@lautech-updates.ng'
    },
    subject: 'ASUU Strike Update - New Resumption Date Announced',
    body: `Dear Students and Staff,

Following the resolution of the ASUU strike, the Senate has approved a new resumption date. All students must complete an online clearance before resumption.

Download the attached clearance form and submit online to avoid being barred from examinations.

Deadline: 48 hours from receipt of this email.

LAUTECH Senate`,
    hasLink: true,
    linkText: 'Download Clearance Form',
    linkUrl: 'http://lautech-updates.ng/clearance',
    hasAttachment: true,
    attachmentName: 'Clearance_Form.exe',
    redFlags: ['Fake domain (lautech-updates.ng not lautech.edu.ng)', 'Executable file attachment (.exe)', 'Exploiting strike anxiety', '48-hour pressure'],
    explanation: 'This is phishing. It exploits the common ASUU strike situation to create urgency. The .exe file is malware. Official LAUTECH announcements come from lautech.edu.ng and are posted on the official website.'
  },
  {
    id: '5',
    type: 'legitimate',
    sender: {
      name: 'LAUTECH Library',
      email: 'library@lautech.edu.ng'
    },
    subject: 'New E-Resources Available for Students',
    body: `Dear Students,

The LAUTECH Library is pleased to announce access to new electronic databases and journals for the 2025/2026 academic session.

Available resources:
- JSTOR Academic Journals
- IEEE Xplore Digital Library
- ScienceDirect

Access these resources by logging into the library portal with your student ID at library.lautech.edu.ng.

For training on how to use these resources, visit the e-Library section on the ground floor of the Main Library, Ogbomoso campus.

LAUTECH University Library`,
    redFlags: [],
    explanation: 'This is legitimate. It comes from the official lautech.edu.ng domain, provides specific resource details, and directs students to the official library portal with physical location reference.'
  },
  {
    id: '6',
    type: 'phishing',
    sender: {
      name: 'Prof. Adeyemi (HOD)',
      email: 'prof.adeyemi.hod@gmail.com'
    },
    subject: 'Urgent - Final Year Project Supervision Fee',
    body: `Dear Student,

I am your assigned project supervisor for this session. Due to the increased number of project students, the department has approved a supervision fee of ₦25,000 payable directly.

Please purchase recharge cards worth ₦25,000 and send the PINs to this email or my WhatsApp (08012345678) before our first meeting.

This is confidential and time-sensitive.

Prof. Adeyemi
Head of Department`,
    redFlags: ['Personal Gmail for official business', 'Requesting recharge card PINs', 'Confidentiality request', 'Unusual payment method'],
    explanation: 'This is a scam. LAUTECH lecturers use official university emails. No legitimate supervision fee is paid via recharge cards. Always verify such requests through official department channels.'
  },
  {
    id: '7',
    type: 'legitimate',
    sender: {
      name: 'LAUTECH Student Affairs',
      email: 'studentaffairs@lautech.edu.ng'
    },
    subject: 'Hostel Allocation for 2025/2026 Session Now Open',
    body: `Dear Students,

The hostel allocation portal for the 2025/2026 academic session is now open. Bed spaces are allocated on a first-come, first-served basis.

To apply:
1. Log in to portal.lautech.edu.ng
2. Navigate to "Hostel Services"
3. Select your preferred hostel and room type
4. Complete payment via the approved payment gateway

Allocation closes on April 15th. For inquiries, visit the Student Affairs office at the Administrative Block, Main Campus, Ogbomoso.

Student Affairs Division
LAUTECH`,
    redFlags: [],
    explanation: 'This is legitimate. It uses the official university domain, provides clear instructions through the official portal, and references physical university locations for support.'
  },
  {
    id: '8',
    type: 'phishing',
    sender: {
      name: 'LAUTECH Scholarship Board',
      email: 'scholarships@lautech-grants.org'
    },
    subject: 'Congratulations! You Won a ₦500,000 LAUTECH Merit Scholarship',
    body: `Dear Beneficiary,

Congratulations! You have been selected as a recipient of the LAUTECH Merit Scholarship Award worth ₦500,000.

This scholarship was awarded based on your academic performance. To claim your scholarship, you must pay a processing fee of ₦15,000 within 72 hours.

Send payment to:
Account: 0123456789
Bank: First Bank
Name: Scholarship Processing Unit

After payment, forward your teller/receipt to this email for immediate disbursement.`,
    hasLink: true,
    linkText: 'View Scholarship Details',
    linkUrl: 'http://lautech-grants.org/scholarship',
    redFlags: ['Fake domain (lautech-grants.org)', 'Advance fee request', 'Unsolicited scholarship win', 'Personal bank account'],
    explanation: 'This is a classic advance-fee scam. LAUTECH scholarships are announced on the official website and never require upfront payment. The domain is fake and the bank account is personal.'
  },
  {
    id: '9',
    type: 'legitimate',
    sender: {
      name: 'LAUTECH ICT Center',
      email: 'ict@lautech.edu.ng'
    },
    subject: 'Scheduled Network Maintenance - Campus Wi-Fi',
    body: `Dear Students and Staff,

This is to inform you that the ICT Center will carry out scheduled maintenance on the campus Wi-Fi network this Saturday, March 15th, from 11:00 PM to 4:00 AM.

During this period:
- Campus Wi-Fi will be temporarily unavailable
- The student portal will be accessible via mobile data
- Email services will not be affected

No action is required on your part. For questions, contact the ICT Help Desk at the ICT Building, Main Campus or call ext. 2200.

ICT Center
LAUTECH, Ogbomoso`,
    redFlags: [],
    explanation: 'This is legitimate. It comes from the official lautech.edu.ng domain, provides specific maintenance details, requires no action, and gives verifiable contact information.'
  },
  {
    id: '10',
    type: 'phishing',
    sender: {
      name: 'LAUTECH VC Office',
      email: 'vc-office@lautech-admin.com'
    },
    subject: 'Vice Chancellor\'s Emergency Relief Fund - Apply Now',
    body: `Dear Student,

In response to the recent flooding that affected Ogbomoso and surrounding areas, the Vice Chancellor has approved an emergency relief fund of ₦100,000 per affected student.

To apply, you must submit your personal details including:
- Full name and matric number
- BVN (Bank Verification Number)
- ATM card details for direct transfer
- Copy of your student ID

Applications close in 24 hours due to limited funds.

Office of the Vice Chancellor
LAUTECH`,
    hasLink: true,
    linkText: 'Apply for Relief Fund',
    linkUrl: 'http://lautech-admin.com/relief',
    redFlags: ['Fake domain (lautech-admin.com)', 'Requesting BVN and ATM details', 'Exploiting real disaster events', '24-hour pressure'],
    explanation: 'This is phishing exploiting the real flooding events in Ogbomoso. The university would never request BVN or ATM card details via email. Relief applications go through the Student Affairs office.'
  },
  {
    id: '11',
    type: 'phishing',
    sender: {
      name: 'LAUTECH SIWES Coordinator',
      email: 'siwes@lautech-industrial.com'
    },
    subject: 'SIWES Placement Confirmation Required',
    body: `Dear 300/400 Level Student,

Your SIWES (Students Industrial Work Experience Scheme) placement has been confirmed with a top company. However, you must pay a placement facilitation fee of ₦30,000 online to secure your slot.

This offer expires today. Click below to make payment and download your placement letter.

Note: This is a one-time opportunity and slots are extremely limited.

SIWES Coordination Unit
LAUTECH`,
    hasLink: true,
    linkText: 'Secure Your Placement',
    linkUrl: 'http://lautech-industrial.com/siwes-pay',
    redFlags: ['Fake domain', 'Unexpected placement facilitation fee', 'Extreme urgency (expires today)', 'SIWES placements don\'t work this way'],
    explanation: 'This is phishing. SIWES placements at LAUTECH are coordinated through the department and ITF, not via email payment links. There is no "facilitation fee" for SIWES placement.'
  },
  {
    id: '12',
    type: 'legitimate',
    sender: {
      name: 'LAUTECH SUG',
      email: 'sug@lautech.edu.ng'
    },
    subject: 'SUG Week 2026 - Event Schedule Released',
    body: `Dear LAUTECHites,

The Students' Union Government is excited to announce the schedule for SUG Week 2026!

Events include:
- Monday: Opening Ceremony at the Amphitheatre
- Tuesday: Inter-Faculty Quiz Competition
- Wednesday: Cybersecurity Awareness Seminar (Senate Building)
- Thursday: Cultural Day & Fashion Show
- Friday: Grand Finale & Musical Concert

All events are free for registered students. Show your student ID at the venue for entry.

For updates, follow our official page or visit the SUG office at the Student Centre.

LAUTECH Students' Union Government`,
    redFlags: [],
    explanation: 'This is legitimate. It comes from the official university domain, references real campus locations (Amphitheatre, Senate Building, Student Centre), and doesn\'t request any personal information or payment.'
  },
  {
    id: '13',
    type: 'phishing',
    sender: {
      name: 'NUC Accreditation Team',
      email: 'accreditation@nuc-nigeria.org'
    },
    subject: 'LAUTECH Programme Accreditation Status - Urgent Student Action',
    body: `IMPORTANT NOTICE

The National Universities Commission (NUC) is conducting a special accreditation review of programmes at LAUTECH.

All students must complete an online verification form to confirm their enrollment status. Students who fail to verify within 48 hours risk having their programme lose accreditation.

Your degree may become invalid if you do not act now.

NUC Accreditation Division`,
    hasLink: true,
    linkText: 'Verify Enrollment Status',
    linkUrl: 'http://nuc-nigeria.org/verify-student',
    redFlags: ['Fake NUC domain (official is nuc.edu.ng)', 'NUC doesn\'t contact students directly', 'Degree invalidation threat', '48-hour deadline'],
    explanation: 'This is phishing. The NUC (National Universities Commission) communicates with university management, not individual students. Their official domain is nuc.edu.ng. Accreditation processes don\'t require student "verification."'
  },
  {
    id: '14',
    type: 'phishing',
    sender: {
      name: 'LAUTECH E-Learning',
      email: 'elearning@lautech-lms.net'
    },
    subject: 'Your Exam Results Have Been Uploaded - Login Required',
    body: `Dear Student,

Your examination results for the 2024/2025 Rain Semester have been uploaded to the new LAUTECH Learning Management System.

Due to the migration from the old portal, you must create a new account by providing:
- Your old portal username and password
- Matric number
- Date of birth

Click below to access your results before they are archived.`,
    hasLink: true,
    linkText: 'View My Results',
    linkUrl: 'http://lautech-lms.net/results',
    hasAttachment: true,
    attachmentName: 'Result_Checker.apk',
    redFlags: ['Fake domain (lautech-lms.net)', 'Requesting old passwords', 'APK file attachment (mobile malware)', 'Results bait'],
    explanation: 'This is phishing. LAUTECH results are accessed through portal.lautech.edu.ng. Never enter your old password on a new site. The .apk attachment is likely mobile malware.'
  },
  {
    id: '15',
    type: 'legitimate',
    sender: {
      name: 'LAUTECH Research Office',
      email: 'research@lautech.edu.ng'
    },
    subject: 'Call for Papers - LAUTECH Annual Research Conference 2026',
    body: `Dear Researchers and Postgraduate Students,

The LAUTECH Research and Innovation Office invites submissions for the Annual Research Conference 2026.

Theme: "Technology and Innovation for Sustainable Development"
Date: May 15-17, 2026
Venue: LAUTECH Senate Building, Ogbomoso

Submission Guidelines:
- Abstract deadline: April 1, 2026
- Full paper deadline: April 20, 2026
- Submit via the research portal at research.lautech.edu.ng

For inquiries, contact the Research Office at the Postgraduate Building or email this address.

Research and Innovation Office
LAUTECH, Ogbomoso`,
    redFlags: [],
    explanation: 'This is legitimate. It uses the official lautech.edu.ng domain, provides specific conference details, references real campus buildings, and directs submissions to an official subdomain.'
  },
  {
    id: '16',
    type: 'phishing',
    sender: {
      name: 'LAUTECH Alumni Association',
      email: 'alumni@lautech-connect.com'
    },
    subject: 'Exclusive Job Opportunity for LAUTECH Graduates',
    body: `Dear LAUTECH Graduate,

Through our partnership with multinational companies, we have exclusive job openings for LAUTECH alumni with starting salaries of ₦500,000/month.

Available positions:
- Software Engineer (Google Nigeria)
- Data Analyst (Shell)
- Project Manager (Dangote Group)

To apply, pay the application processing fee of ₦10,000 and upload your CV. Positions fill up fast!

LAUTECH Alumni Network`,
    hasLink: true,
    linkText: 'Apply Now - Limited Slots',
    linkUrl: 'http://lautech-connect.com/jobs',
    redFlags: ['Fake domain (lautech-connect.com)', 'Application processing fee', 'Too-good-to-be-true salaries', 'Pressure tactics'],
    explanation: 'This is phishing. Legitimate job applications through Google, Shell, or Dangote never require processing fees. The fake alumni domain and unrealistic salary claims are red flags.'
  },
  {
    id: '17',
    type: 'legitimate',
    sender: {
      name: 'LAUTECH Health Centre',
      email: 'healthcentre@lautech.edu.ng'
    },
    subject: 'Free Medical Outreach - All Students Welcome',
    body: `Dear Students,

The LAUTECH Health Centre, in collaboration with the College of Health Sciences, will conduct a free medical outreach programme.

Date: Saturday, March 22, 2026
Time: 9:00 AM - 4:00 PM
Venue: LAUTECH Health Centre, Main Campus, Ogbomoso

Services available:
- General health screening
- Eye test
- Blood pressure and blood sugar check
- Health counseling

Bring your student ID card. No registration fee required.

LAUTECH Health Centre`,
    redFlags: [],
    explanation: 'This is legitimate. It uses the official domain, references a real campus facility, provides specific details, and explicitly states it\'s free with no payment required.'
  },
  {
    id: '18',
    type: 'phishing',
    sender: {
      name: 'CBN Student Loan Board',
      email: 'studentloan@cbn-nelfund.com'
    },
    subject: 'NELFUND Student Loan Approved for LAUTECH Students',
    body: `Dear LAUTECH Student,

Your application for the Nigerian Education Loan Fund (NELFUND) has been pre-approved. You are eligible for a loan of ₦500,000 per session.

To complete your disbursement, verify your identity by providing:
- BVN
- NIN
- Bank account details
- Passport photograph

Disbursement will be made within 24 hours of verification.

NELFUND / Central Bank of Nigeria`,
    hasLink: true,
    linkText: 'Complete Verification',
    linkUrl: 'http://cbn-nelfund.com/verify',
    redFlags: ['Fake domain (not official CBN or NELFUND)', 'Requesting BVN and NIN via email', 'Pre-approved without application', 'Urgency in disbursement'],
    explanation: 'This is phishing exploiting the real NELFUND student loan programme. NELFUND applications are done through nelfund.gov.ng. CBN and NELFUND never request BVN or bank details via email.'
  },
  {
    id: '19',
    type: 'phishing',
    sender: {
      name: 'LAUTECH Transcript Office',
      email: 'transcripts@lautech-records.org'
    },
    subject: 'Transcript Processing - Digital Verification Required',
    body: `Dear Graduate,

LAUTECH has partnered with a new digital verification service for faster transcript processing. All pending transcript requests must be re-submitted through our new platform.

Previous payments will not be refunded. A new processing fee of ₦20,000 is required.

Submit your request within 7 days to avoid delays in your transcript delivery.

Transcript & Records Unit
LAUTECH`,
    hasLink: true,
    linkText: 'Re-submit Transcript Request',
    linkUrl: 'http://lautech-records.org/transcript',
    redFlags: ['Fake domain (.org not .edu.ng)', 'Requesting re-payment', 'No refund for previous payments', 'Artificial deadline'],
    explanation: 'This is phishing. LAUTECH transcript requests are processed through the Registrar\'s office or official portal. The fake domain and demand for re-payment are clear scam indicators.'
  },
  {
    id: '20',
    type: 'legitimate',
    sender: {
      name: 'LAUTECH Career Services',
      email: 'careers@lautech.edu.ng'
    },
    subject: 'Career Fair 2026 - Register to Attend',
    body: `Dear Students,

LAUTECH Career Services is organizing the Annual Career Fair 2026.

Date: April 10-11, 2026
Venue: LAUTECH Multipurpose Hall, Ogbomoso Campus
Time: 10:00 AM - 5:00 PM

Participating organizations include MTN, GTBank, Dangote, Andela, and several tech startups.

To register, visit portal.lautech.edu.ng and navigate to "Career Services." Registration is free for all current students.

Bring copies of your CV and dress professionally.

Career Services Unit
LAUTECH, Ogbomoso`,
    redFlags: [],
    explanation: 'This is legitimate. It uses the official domain, references real campus venues, lists well-known Nigerian companies, directs to the official portal, and registration is free.'
  }
];

export const getRandomScenarios = (count: number = 15): PhishingScenario[] => {
  const shuffled = [...phishingScenarios].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};
