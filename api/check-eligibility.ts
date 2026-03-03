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
    name: "Rythu Bandhu",
    type: "State",
    state: "Telangana",
    conditions: { occupation: "Farmer" },
    benefit: "Investment support per acre for farmers"
  }
];

function checkEligibility(user: any, scheme: any) {
  const age = Number(user.age);
  const income = Number(user.income);
  const conditions = scheme.conditions;

  for (const key in conditions) {
    const value = conditions[key];

    if (key === "min_age" && age < value) return false;
    if (key === "max_income" && income > value) return false;
    if (key === "occupation" && user.occupation !== value) return false;
    if (key === "gender" && user.gender !== value) return false;
    if (key === "marital_status" && user.marital_status !== value) return false;
  }

  if (scheme.type === "State" && scheme.state !== user.state) {
    return false;
  }

  return true;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = req.body;

  const eligible: any[] = [];
  const not_eligible: any[] = [];

  schemes.forEach((scheme) => {
    if (checkEligibility(user, scheme)) {
      eligible.push({
        name: scheme.name,
        type: scheme.type,
        state: scheme.state || "All India",
        benefit: scheme.benefit
      });
    } else {
      not_eligible.push({
        name: scheme.name,
        type: scheme.type,
        state: scheme.state || "All India",
        benefit: scheme.benefit,
        reasons: [{ text: "Does not meet eligibility criteria." }]
      });
    }
  });

  return res.status(200).json({
    name: user.name || "User",
    eligible,
    not_eligible
  });
}
