/* ══════════════════════════════════════════
   ElectEd – Centralized Election Data
   ══════════════════════════════════════════ */

const timelineData = [
  { icon: '📢', date: 'T-6 Months', title: 'Election Announcement', desc: 'The Election Commission officially announces the election schedule, including dates for polling, nominations, and counting.' },
  { icon: '📋', date: 'T-5 Months', title: 'Voter Roll Revision',   desc: 'Citizens can update, correct, or add their names to the electoral roll. Voter ID cards are issued to first-time voters.' },
  { icon: '🏅', date: 'T-3 Months', title: 'Candidate Nominations', desc: 'Eligible candidates file nomination papers with their respective returning officers. Deposits are submitted and scrutinised.' },
  { icon: '📣', date: 'T-2 Months', title: 'Campaign Period Begins', desc: 'Approved candidates begin their campaigns — rallies, debates, and advertising. The Model Code of Conduct is enforced.' },
  { icon: '🔇', date: 'T-48 Hours', title: 'Campaign Silence',       desc: 'Campaigning ceases 48 hours before polling to allow voters to make undisturbed decisions.' },
  { icon: '🗳️', date: 'Polling Day', title: 'Voting',                desc: 'Registered voters visit their designated polling stations, verify identity, and cast their votes using EVMs or paper ballots.' },
  { icon: '📊', date: 'Counting Day', title: 'Vote Counting',         desc: 'Ballots are counted under strict supervision. Candidates, agents, and observers witness the process for transparency.' },
  { icon: '🏆', date: 'Results Day', title: 'Results & Swearing-In', desc: 'Winners are declared, certificates issued, and the elected government is formed. New officials are sworn into office.' },
];

const stepsData = {
  voter: [
    { title: 'Check Eligibility',    desc: 'Must be 18+ years old and a citizen. Persons of unsound mind or convicted felons may be disqualified.' },
    { title: 'Voter Registration',   desc: 'Apply online at your Election Commission portal or visit a local registration centre with identity proof.' },
    { title: 'Receive Voter ID',     desc: 'An Elector Photo Identity Card (EPIC) is issued as proof of registration — keep it safe.' },
    { title: 'Find Your Booth',      desc: 'Use the official voter portal or helpline to locate your assigned polling station and booth number.' },
    { title: 'Review Candidates',    desc: 'Read manifesto summaries, attend debates, and research candidates standing in your constituency.' },
    { title: 'Cast Your Vote',       desc: 'Arrive at your polling station, verify your identity, receive a ballot/EVM token, and vote in secret.' },
  ],
  candidate: [
    { title: 'Meet Eligibility Criteria',    desc: 'Must be a citizen, at least 25 years old (Lok Sabha), and registered as a voter in the country.' },
    { title: 'Choose a Party or Stand Independently', desc: 'Align with a registered political party or file as an independent candidate.' },
    { title: 'File Nomination Papers',       desc: 'Submit Form 2B to the Returning Officer along with the required security deposit.' },
    { title: 'Scrutiny & Withdrawal',        desc: 'Nominations are scrutinised; candidates may withdraw before the deadline if they change their mind.' },
    { title: 'Run Your Campaign',            desc: 'Hold rallies, door-to-door canvassing, and media outreach within spending limits set by the Commission.' },
    { title: 'Polling & Results',            desc: 'Vote yourself, monitor your polling agents, and await the officially declared result.' },
  ],
  observer: [
    { title: 'Accreditation',               desc: 'Apply to the Election Commission or an accredited international body to be an official election observer.' },
    { title: 'Pre-Election Briefing',        desc: 'Attend mandatory briefings on observer guidelines, neutrality rules, and reporting procedures.' },
    { title: 'Monitor Campaign Period',      desc: 'Track campaigning activities, spending, and compliance with the Model Code of Conduct.' },
    { title: 'Observe Polling',              desc: 'Visit polling stations to observe queue management, secrecy of vote, and EVM handling.' },
    { title: 'Monitor Counting',             desc: 'Observe the counting centre to verify that all ballots/EVM data are counted fairly.' },
    { title: 'Submit Final Report',          desc: 'File a comprehensive neutrality-based report to the accrediting body within the stipulated deadline.' },
  ],
};

const rolesData = [
  { emoji: '🏛️', title: 'Election Commission',  desc: 'The supreme body that plans, conducts, and supervises the entire election process with full constitutional authority.' },
  { emoji: '🧑‍⚖️', title: 'Returning Officer',    desc: 'District-level official responsible for overseeing polling in a constituency, accepting nominations, and declaring results.' },
  { emoji: '👮',  title: 'Polling Officer',      desc: 'Manages a polling booth — verifies voters, operates EVMs, and ensures orderly conduct on Election Day.' },
  { emoji: '🗳️', title: 'Voter',                 desc: 'Every eligible citizen who exercises the right to vote. The most powerful role in a democracy.' },
  { emoji: '🏅', title: 'Candidate',             desc: 'An individual who contests the election to represent a constituency in a legislative body.' },
  { emoji: '👁️', title: 'Election Observer',     desc: 'Monitors the process to ensure fairness — can be domestic civil-society members or international delegates.' },
  { emoji: '📰', title: 'Media',                 desc: 'Accredited journalists who report on campaigns, polling, and results, keeping the public informed.' },
  { emoji: '⚖️', title: 'Judiciary',             desc: 'Courts hear election disputes, petitions, and enforce electoral law impartially and swiftly.' },
];

const quizData = [
  { id:1,  q:'What is the minimum age to vote in most democracies?',          opts:['16','21','18','25'],                                               ans:2, exp:'In most countries, including India, the voting age is 18 years, established to balance youth participation and civic maturity.' },
  { id:2,  q:'What does EVM stand for?',                                       opts:['Electronic Voting Machine','Election Verification Module','Electoral Vote Monitor','Electronic Vote Manager'], ans:0, exp:'EVM stands for Electronic Voting Machine, used in Indian elections since the 1980s to reduce paper ballots and speed up counting.' },
  { id:3,  q:'Which body conducts general elections in India?',                opts:['Parliament of India','Supreme Court','Election Commission of India','Ministry of Home Affairs'],             ans:2, exp:'The Election Commission of India (ECI) is a constitutionally established body that oversees elections independently.' },
  { id:4,  q:'What is the Model Code of Conduct?',                             opts:['A code for how MPs behave in parliament','Guidelines candidates/parties must follow during elections','Rules for election observers','Voter registration manual'], ans:1, exp:'The Model Code of Conduct is a set of guidelines issued by the ECI that political parties and candidates must follow during the election period.' },
  { id:5,  q:'What is a constituency?',                                        opts:['A political party headquarters','A geographic area that elects one representative','The building where votes are counted','A voter ID card'], ans:1, exp:'A constituency is a defined geographic area whose registered voters elect a single representative to the legislature.' },
  { id:6,  q:'What is NOTA on an Indian ballot?',                              opts:['Name of the Applicant','None of the Above','National Observer Tracking Agency','No Official Tally Allowed'], ans:1, exp:'NOTA means "None of the Above" — it allows voters to reject all candidates without spoiling their ballot.' },
  { id:7,  q:'How many hours before polling must election campaigns stop?',    opts:['24 hours','12 hours','48 hours','72 hours'],                       ans:2, exp:'The Model Code of Conduct requires all campaigning to cease 48 hours before polling begins, giving voters quiet time to decide.' },
  { id:8,  q:'What is a By-Election?',                                         opts:['An election held every two years','An election held when a seat becomes vacant mid-term','A regional election','A referendum'], ans:1, exp:'A By-election is held to fill a vacant seat caused by death, resignation, or disqualification of a sitting member.' },
  { id:9,  q:'Which document proves voter registration in India?',             opts:['Passport','Aadhaar Card','EPIC – Voter ID Card','PAN Card'],        ans:2, exp:'The Elector Photo Identity Card (EPIC), commonly called the Voter ID, is the official proof of voter registration in India.' },
  { id:10, q:'Who counts the votes after polling day?',                        opts:['The candidates themselves','Appointed counting staff under strict supervision','A computer AI system','State police'], ans:1, exp:'Votes are counted by specially appointed officials at designated counting centres, under the supervision of observers and candidate agents.' },
];

module.exports = { timelineData, stepsData, rolesData, quizData };
