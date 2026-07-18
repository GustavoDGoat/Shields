import { QuestionnaireQuestion } from './types';

export const QUESTIONNAIRE_QUESTION_COUNT = 5;
export const POINTS_PER_CORRECT = 10;

export const questionnairePool: QuestionnaireQuestion[] = [
  {
    id: 'q1',
    section: 'knowledge',
    question:
      'You receive an urgent WhatsApp message from a coursemate\'s number saying: "Abeg, I\'m stranded and my bank app is acting up. Send me N10k to this OPay account, I\'ll refund you tomorrow." What is the most likely situation?',
    options: [
      { key: 'A', text: 'My coursemate needs immediate financial help.' },
      { key: 'B', text: 'It is a network error duplicating old messages.' },
      { key: 'C', text: 'My coursemate\'s account has been compromised by a scammer (Yahoo-Yahoo tactic).' },
    ],
    correctOptions: ['C'],
  },
  {
    id: 'q2',
    section: 'knowledge',
    question:
      'An email arrives from admin@university-portal-edu.ng.com stating your previous semester results have been withheld and you must click a link to pay a N5,000 "Clearance Processing Fee." What should you do?',
    options: [
      { key: 'A', text: 'Click the link and pay to avoid having an extra year.' },
      { key: 'B', text: 'Reply to the email asking for more clarification.' },
      { key: 'C', text: 'Recognize it as a "Result Upgrade/Clearance" phishing scam and do not click.' },
    ],
    correctOptions: ['C'],
  },
  {
    id: 'q3',
    section: 'attitude',
    question:
      '"Cybercriminals are mostly interested in targeting banks, corporations, and wealthy individuals, so my university student account is not a valuable target."',
    options: [
      { key: 'A', text: 'Strongly Agree' },
      { key: 'B', text: 'Agree' },
      { key: 'C', text: 'Neutral' },
      { key: 'D', text: 'Disagree' },
      { key: 'E', text: 'Strongly Disagree' },
    ],
    correctOptions: ['D', 'E'],
  },
  {
    id: 'q4',
    section: 'behavior',
    question:
      'If you receive a highly suspicious email in your student inbox, what is your standard reaction?',
    options: [
      { key: 'A', text: 'I click the links just to see if it is real.' },
      { key: 'B', text: 'I simply delete the email and move on with my day.' },
      { key: 'C', text: 'I actively use the portal\'s "Report as Phishing" button so IT can investigate.' },
    ],
    correctOptions: ['C'],
  },
  {
    id: 'q5',
    section: 'behavior',
    question:
      'If you accidentally clicked a bad link and realized you might have downloaded malware onto the school\'s Wi-Fi network, how likely are you to report it?',
    options: [
      { key: 'A', text: 'Very Unlikely (I would be too scared of getting into trouble).' },
      { key: 'B', text: 'Unlikely (I would just turn off my laptop and hope it goes away).' },
      { key: 'C', text: 'Neutral.' },
      { key: 'D', text: 'Very Likely (I know reporting it quickly protects the network).' },
    ],
    correctOptions: ['D'],
  },
  {
    id: 'q6',
    section: 'behavior',
    question:
      'The deadline for course registration is tomorrow, and the university portal is very slow. A third-party "cyber cafe agent" on campus tells you to WhatsApp them your Matric Number and portal password so they can run a script to register for you at midnight. What is the safest response?',
    options: [
      { key: 'A', text: 'Send the details immediately so you don\'t miss the deadline.' },
      { key: 'B', text: 'Send the details, but plan to change your password sometime next semester.' },
      { key: 'C', text: 'Refuse to share the details, recognizing that sharing portal credentials exposes your academic records and personal data to hijacking.' },
    ],
    correctOptions: ['C'],
  },
  {
    id: 'q7',
    section: 'knowledge',
    question:
      'You take your USB flash drive to a campus business center to print your project chapter. When you plug the flash drive back into your personal laptop, all your folders have turned into 1KB "shortcuts." What should you do?',
    options: [
      { key: 'A', text: 'Click the shortcuts to try and open your project files quickly.' },
      { key: 'B', text: 'Safely eject the drive, update your antivirus, and run a full system scan, recognizing this as a classic malware infection.' },
      { key: 'C', text: 'Ignore it; it is just a normal Windows glitch that happens at business centers.' },
    ],
    correctOptions: ['B'],
  },
  {
    id: 'q8',
    section: 'knowledge',
    question:
      'A message is forwarded multiple times to your departmental WhatsApp group stating: "FG is giving out N50,000 Student Relief Funds for the new semester. Click this link [bit.ly/fg-student-fund] to submit your BVN and Matric Number to get yours immediately." What is the reality of this message?',
    options: [
      { key: 'A', text: 'It is a legitimate government program that I should apply for quickly.' },
      { key: 'B', text: 'It is a credential-harvesting phishing scam designed to steal my bank details and identity.' },
      { key: 'C', text: 'It is a harmless forward, so I will click the link just to see if the portal works.' },
    ],
    correctOptions: ['B'],
  },
  {
    id: 'q9',
    section: 'attitude',
    question:
      '"It is perfectly safe to give my university portal password to my course rep or a friend so they can help me register for a course or check my results if my network connection is bad."',
    options: [
      { key: 'A', text: 'Strongly Agree' },
      { key: 'B', text: 'Agree' },
      { key: 'C', text: 'Neutral' },
      { key: 'D', text: 'Disagree' },
      { key: 'E', text: 'Strongly Disagree' },
    ],
    correctOptions: ['D', 'E'],
  },
  {
    id: 'q10',
    section: 'behavior',
    question:
      'You receive an email that appears to be from your lecturer with an attached file named Exam_Questions_Draft.zip. However, you notice the sender\'s email address is dr.lecturer123@yahoo.com instead of the official university webmail. What is the safest course of action?',
    options: [
      { key: 'A', text: 'Download the file quickly to see what is inside before they realize their mistake.' },
      { key: 'B', text: 'Ignore the email, delete it, and tell no one, assuming someone else will figure it out.' },
      { key: 'C', text: 'Do not download the file, and immediately use the portal to report the email as a potential phishing attack impersonating faculty.' },
    ],
    correctOptions: ['C'],
  },
];

export const getRandomQuestions = (count: number = QUESTIONNAIRE_QUESTION_COUNT): QuestionnaireQuestion[] => {
  const shuffled = [...questionnairePool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
};
