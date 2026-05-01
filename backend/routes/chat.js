/* ══════════════════════════════════════════
   Route: /api/chat
   Smart keyword-based AI assistant
   ══════════════════════════════════════════ */
const express = require('express');
const router = express.Router();

const kb = [
  {
    keys: ['register', 'registration', 'enrol', 'sign up', 'how do i vote'],
    topic: 'Voter Registration',
    reply: `**How to Register as a Voter:**

1. **Check eligibility** – You must be 18+ and a citizen.
2. **Visit the official portal** – In India, go to [voters.eci.gov.in](https://voters.eci.gov.in).
3. **Fill Form 6** – For new voters registering for the first time.
4. **Submit documents** – Age proof (birth certificate/passport) and address proof.
5. **Receive your EPIC (Voter ID)** – Usually within 30 days.

You can also register offline at your nearest BLO (Booth Level Officer) office.`
  },
  {
    keys: ['election day', 'polling day', 'voting day', 'cast my vote', 'what happens on election'],
    topic: 'Election Day',
    reply: `**On Election Day:**

1. Bring your **Voter ID card (EPIC)** to your assigned polling booth.
2. Your name will be checked against the **electoral roll**.
3. Your finger is marked with **indelible ink** to prevent double voting.
4. You'll be directed to an **EVM (Electronic Voting Machine)**.
5. Press the button next to your chosen candidate.
6. A **VVPAT slip** will briefly appear to confirm your vote.

🗳️ The whole process usually takes under 5 minutes!`
  },
  {
    keys: ['constituency', 'constituencies', 'what is a constituency'],
    topic: 'Constituency',
    reply: `**What is a Constituency?**

A constituency is a geographic area represented by one elected official.

- **Lok Sabha** (India) has **543 constituencies** — one MP per constituency.
- **State Assemblies** have their own set of constituencies for MLAs.
- Boundaries are drawn by the **Delimitation Commission** based on population.

Every voter belongs to exactly one constituency and votes for their local representative.`
  },
  {
    keys: ['count', 'counting', 'tally', 'how are votes', 'vote counting'],
    topic: 'Vote Counting',
    reply: `**How Votes Are Counted:**

1. After polling closes, **EVM control units** are sealed and transported to counting centres.
2. On counting day, EVMs are opened in the presence of **candidates, their agents, and observers**.
3. Results are displayed round-by-round for each polling station.
4. **VVPAT slips** from 5 randomly selected booths per constituency are verified.
5. The **Returning Officer** declares the winner once all rounds are complete.

📊 The entire process is transparent and carefully supervised.`
  },
  {
    keys: ['evm', 'electronic voting machine', 'vvpat'],
    topic: 'EVM & VVPAT',
    reply: `**About EVMs (Electronic Voting Machines):**

- Introduced in India in **1982**, fully adopted by **2004**.
- Consist of two units: **Ballot Unit** (voter side) and **Control Unit** (officer side).
- Can store up to **2,000 votes** and last on a single battery for the full day.
- Come with **VVPAT** (Voter Verifiable Paper Audit Trail) for transparency.
- Are **standalone machines** — not connected to the internet, making them hack-proof.

🔒 EVMs are kept in secure, double-locked strong rooms between elections.`
  },
  {
    keys: ['nota', 'none of the above'],
    topic: 'NOTA',
    reply: `**What is NOTA?**

NOTA stands for **"None of the Above"**.

- Introduced in India after a **Supreme Court order in 2013**.
- Allows voters to **reject all candidates** without spoiling their ballot.
- The NOTA button is the **last option** on every EVM.
- If NOTA gets the most votes, the candidate with the **next highest votes wins**.

✅ It strengthens voter expression and holds parties accountable for fielding quality candidates.`
  },
  {
    keys: ['candidate', 'stand for election', 'nominate', 'how to contest', 'become a candidate'],
    topic: 'Becoming a Candidate',
    reply: `**How to Become a Candidate:**

1. **Meet eligibility** – Citizen, 25+ years (Lok Sabha), registered voter.
2. **Choose affiliation** – Join a political party or stand as an independent.
3. **File nomination** – Submit Form 2B to the Returning Officer with the security deposit (₹25,000 for LS).
4. **Scrutiny** – The RO checks the nomination for validity.
5. **Withdrawal period** – You can withdraw before the last date if needed.
6. **Campaign** – Conduct campaigns within the EC's spending limits.
7. **Polling & Results** – Await the officially declared result.`
  },
  {
    keys: ['model code', 'code of conduct', 'mcc'],
    topic: 'Model Code of Conduct',
    reply: `**Model Code of Conduct (MCC):**

The MCC is issued by the **Election Commission of India** to ensure free and fair elections.

**Key rules:**
- No new government schemes that could influence voters.
- No use of government machinery for campaigning.
- No hate speech, communal appeals, or vote-for-cash deals.
- All public meetings require prior permission from authorities.

🔔 The MCC kicks in the moment the election schedule is announced and stays until results are declared.`
  },
  {
    keys: ['observer', 'monitoring', 'international observer', 'election observer'],
    topic: 'Election Observers',
    reply: `**Election Observers:**

Observers ensure the election is conducted fairly.

**Types:**
- **General Observers** – Monitor overall conduct of elections.
- **Expenditure Observers** – Track candidate spending limits.
- **Police Observers** – Monitor law and order.
- **International Observers** – Invited by EC to report to global bodies.

They can inspect any polling station, counting centre, and campaign activity.`
  },
  {
    keys: ['what is election', 'define election', 'election meaning', 'what is an election'],
    topic: 'What is an Election?',
    reply: `**What is an Election?**

An election is a formal democratic process by which **citizens choose their representatives** or decide on proposals through voting.

**Key characteristics:**
- 🗓️ Held at regular intervals (every 5 years in India for Lok Sabha)
- 🏛️ Overseen by an independent Election Commission
- 🔒 Secret ballot to protect voter freedom
- ⚖️ Governed by strict laws and codes of conduct

Elections are the cornerstone of democracy — they ensure that power rests with the people.`
  },
  {
    keys: ['by-election', 'by election', 'byelection', 'vacant seat'],
    topic: 'By-Election',
    reply: `**What is a By-Election?**

A by-election (or bye-election) is held to fill a **vacant legislative seat** mid-term.

**Common reasons for a vacancy:**
- Death of the sitting member
- Resignation from the seat
- Disqualification by the court or EC

By-elections follow the same process as general elections, just for a single constituency.`
  },
  {
    keys: ['voter id', 'epic', 'voter card', 'id proof'],
    topic: 'Voter ID Card',
    reply: `**The Voter ID Card (EPIC):**

EPIC stands for **Elector Photo Identity Card**.

- Issued by the **Election Commission of India**.
- Required as identity proof at polling booths.
- Contains: Name, Photo, Voter ID Number, Address, and Polling Booth details.

**If you lost your Voter ID:**
You can download a digital copy from [voters.eci.gov.in](https://voters.eci.gov.in) using your registered mobile number.`
  },
  {
    keys: ['postal ballot', 'absentee voting', 'vote from home'],
    topic: 'Postal Ballot',
    reply: `**Postal Ballot (Absentee Voting):**

Certain voters can cast their vote **by post** if they can't visit a polling station.

**Eligible categories:**
- Armed forces personnel and their spouses
- Government officials on election duty
- Senior citizens (80+) and persons with disabilities (in some states)
- People in preventive detention

You must apply for a postal ballot **before the deadline** set by the Election Commission.`
  },
  {
    keys: ['how long', 'duration', 'campaign period', 'election period', 'how many days'],
    topic: 'Election Duration',
    reply: `**Election Timeline at a Glance:**

| Phase | Duration |
|---|---|
| Announcement to Polling | ~4–6 weeks typically |
| Campaign silence period | 48 hours before polling |
| Counting after polling | Same day or next day |
| Results to swearing-in | 2–4 weeks |

In India, a **Lok Sabha election** often spans multiple phases (up to 7) spread over 4–6 weeks due to the country's size.`
  },
];

// POST /api/chat
router.post('/', (req, res) => {
  const message = (req.body.message || '').toLowerCase().trim();

  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  for (const entry of kb) {
    if (entry.keys.some(k => message.includes(k))) {
      return res.json({ reply: entry.reply, topic: entry.topic });
    }
  }

  // Fallback
  return res.json({
    topic: 'General',
    reply: `I'm here to help with election-related questions! 🗳️

You can ask me about:
- **Voter registration** steps
- What happens on **Election Day**
- What a **constituency** is
- How **votes are counted**
- About **EVMs** or **NOTA**
- The **Model Code of Conduct**
- How to **become a candidate**
- **Postal ballots** and absentee voting
- **By-elections** and vacant seats

Try asking one of those topics!`
  });
});

module.exports = router;
