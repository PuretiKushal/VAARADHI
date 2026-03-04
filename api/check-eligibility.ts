import type { VercelRequest, VercelResponse } from '@vercel/node';

const schemes = [
  {
    name: "PM Kisan Samman Nidhi",
    type: "Central",
    conditions: { occupation: "Farmer", max_income: 600000 },
    benefit: "₹6000 annual income support for farmers"
  },
  {
    name: "Ayushman Bharat (PM-JAY)",
    type: "Central",
    conditions: { max_income: 300000 },
    benefit: "Health insurance coverage up to ₹5 lakh per family"
  },
  {
    name: "Pradhan Mantri Awas Yojana",
    type: "Central",
    conditions: { max_income: 300000 },
    benefit: "Subsidy for affordable housing"
  },
  {
    name: "National Widow Pension Scheme",
    type: "Central",
    conditions: {
      gender: "Female",
      marital_status: "Widow",
      min_age: 40,
      max_income: 200000
    },
    benefit: "Monthly pension assistance"
  },
  {
    name: "PM Scholarship Scheme",
    type: "Central",
    conditions: { occupation: "Student", max_income: 250000 },
    benefit: "Higher education financial support"
  },
  {
    name: "YSR Rythu Bharosa",
    type: "State",
    state: "Andhra Pradesh",
    conditions: { occupation: "Farmer", max_income: 500000 },
    benefit: "₹13,500 yearly farmer investment assistance"
  },
  {
    name: "YSR Pension Kanuka",
    type: "State",
    state: "Andhra Pradesh",
    conditions: { min_age: 60, max_income: 200000 },
    benefit: "Monthly pension for elderly citizens"
  },
  {
    name: "YSR Amma Vodi",
    type: "State",
    state: "Andhra Pradesh",
    conditions: { occupation: "Student", max_income: 300000 },
    benefit: "₹15,000 yearly education support"
  },
  {
    name: "Rythu Bandhu",
    type: "State",
    state: "Telangana",
    conditions: { occupation: "Farmer" },
    benefit: "Investment support per acre for farmers"
  },
  {
    name: "KCR Kit Scheme",
    type: "State",
    state: "Telangana",
    conditions: { gender: "Female", max_income: 300000 },
    benefit: "Support for pregnant women and newborn care"
  },
  {
    name: "Kalaignar Health Insurance Scheme",
    type: "State",
    state: "Tamil Nadu",
    conditions: { max_income: 250000 },
    benefit: "Free advanced medical treatment"
  },
  {
    name: "Tamil Nadu Marriage Assistance Scheme",
    type: "State",
    state: "Tamil Nadu",
    conditions: { gender: "Female", max_income: 200000 },
    benefit: "Financial support for marriage expenses"
  },
  {
    name: "Kanyashree Prakalpa",
    type: "State",
    state: "West Bengal",
    conditions: { gender: "Female", occupation: "Student", max_income: 200000 },
    benefit: "Scholarship for girl students"
  },
  {
    name: "Ladli Laxmi Yojana",
    type: "State",
    state: "Madhya Pradesh",
    conditions: { gender: "Female", max_income: 200000 },
    benefit: "Financial security scheme for girl children"
  },
  {
    name: "Mukhyamantri Kanya Utthan Yojana",
    type: "State",
    state: "Bihar",
    conditions: { gender: "Female", occupation: "Student" },
    benefit: "Education incentives for girls"
  },
  {
    name: "Delhi Ladli Scheme",
    type: "State",
    state: "Delhi",
    conditions: { gender: "Female", max_income: 300000 },
    benefit: "Financial support for girl child education"
  },
  {
    name: "Mahatma Jyotiba Phule Jan Arogya Yojana",
    type: "State",
    state: "Maharashtra",
    conditions: { max_income: 300000 },
    benefit: "Free medical treatment coverage"
  },
  {
    name: "PM Ujjwala Yojana",
    type: "Central",
    conditions: { max_income: 200000 },
    benefit: "Free LPG gas connection for low-income households"
  },
  {
    name: "Atal Pension Yojana",
    type: "Central",
    conditions: { min_age: 18, max_income: 500000 },
    benefit: "Guaranteed pension after retirement"
  },
  {
    name: "Stand Up India Scheme",
    type: "Central",
    conditions: { gender: "Female", max_income: 800000 },
    benefit: "Bank loans for women entrepreneurs"
  },
  {
    name: "Skill India Training Program",
    type: "Central",
    conditions: { occupation: "Unemployed" },
    benefit: "Free skill development training programs"
  },
  {
    name: "Gruha Lakshmi Scheme",
    type: "State",
    state: "Karnataka",
    conditions: { gender: "Female", max_income: 300000 },
    benefit: "₹2000 monthly financial assistance to women heads"
  },
  {
    name: "Anna Bhagya Scheme",
    type: "State",
    state: "Karnataka",
    conditions: { max_income: 200000 },
    benefit: "Free food grains distribution"
  },
  {
    name: "Mukhyamantri Chiranjeevi Health Scheme",
    type: "State",
    state: "Rajasthan",
    conditions: { max_income: 300000 },
    benefit: "Cashless health insurance coverage"
  },
  {
    name: "Indira Gandhi Urban Employment Scheme",
    type: "State",
    state: "Rajasthan",
    conditions: { occupation: "Unemployed" },
    benefit: "Urban employment guarantee program"
  },
  {
    name: "Chief Minister Farmer Welfare Scheme",
    type: "State",
    state: "Madhya Pradesh",
    conditions: { occupation: "Farmer" },
    benefit: "Financial assistance for agricultural activities"
  },
  {
    name: "Sikshashree Scheme",
    type: "State",
    state: "West Bengal",
    conditions: { occupation: "Student", max_income: 200000 },
    benefit: "Scholarship support for school students"
  },
  {
    name: "Delhi Free Electricity Scheme",
    type: "State",
    state: "Delhi",
    conditions: { max_income: 300000 },
    benefit: "Free electricity up to specified consumption limit"
  },
  {
    name: "Mazi Kanya Bhagyashree",
    type: "State",
    state: "Maharashtra",
    conditions: { gender: "Female", max_income: 250000 },
    benefit: "Financial savings scheme for girl child"
  },
  {
    name: "Orunodoi Scheme",
    type: "State",
    state: "Assam",
    conditions: { gender: "Female", max_income: 200000 },
    benefit: "Monthly financial support for women-led households"
  },
  {
    name: "Krushak Assistance for Livelihood and Income Augmentation (KALIA)",
    type: "State",
    state: "Odisha",
    conditions: { occupation: "Farmer" },
    benefit: "Financial assistance and livelihood support"
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, age, income, occupation, gender, marital_status, state } = req.body;

  const eligible: any[] = [];
  const not_eligible: any[] = [];

  schemes.forEach(scheme => {
    const reasons: { text: string }[] = [];
    const cond = scheme.conditions as any;

    // 1. Check State (Central schemes apply to ALL states)
    if (scheme.type === "State" && scheme.state !== state) {
      reasons.push({ text: `Only available for residents of ${scheme.state}` });
    }

    // 2. Check Occupation (Only if a specific occupation is required)
    if (cond.occupation && cond.occupation !== occupation) {
      reasons.push({ text: `Requires occupation to be: ${cond.occupation}` });
    }

    // 3. Check Income
    if (cond.max_income && income > cond.max_income) {
      reasons.push({ text: `Annual income must be below ₹${cond.max_income}` });
    }

    // 4. Check Gender
    if (cond.gender && cond.gender !== gender) {
      reasons.push({ text: `Scheme specifically for ${cond.gender} applicants` });
    }

    // 5. Check Age
    if (cond.min_age && age < cond.min_age) {
      reasons.push({ text: `Minimum age required: ${cond.min_age} years` });
    }

    // 6. Check Marital Status
    if (cond.marital_status && cond.marital_status !== marital_status) {
      reasons.push({ text: `Required marital status: ${cond.marital_status}` });
    }

    // Sort into results
    if (reasons.length === 0) {
      eligible.push(scheme);
    } else {
      not_eligible.push({ ...scheme, reasons });
    }
  });

  return res.status(200).json({
    name: name,
    eligible: eligible,
    not_eligible: not_eligible
  });
}