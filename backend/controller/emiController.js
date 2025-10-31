exports.calculateEMI = (req, res) => {
  const { onRoadPrice, downPayment, tenure, interestRate, cibilScore } = req.body;
  const principal = onRoadPrice - downPayment;
  const monthlyRate = interestRate / 12 / 100;
  const months = tenure * 12;

  if (principal <= 0 || monthlyRate <= 0 || months <= 0) {
    return res.status(400).json({ error: "Invalid input values. onRoadPrice, downPayment, tenure, and interestRate must be positive." });
  }

  // EMI formula
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
  const totalInterest = emi * months - principal;
  const amortization = [];
  let remainingPrincipal = principal;

  for (let i = 1; i <= months; i++) {
    const interestPaid = remainingPrincipal * monthlyRate;
    const principalPaid = emi - interestPaid;
    remainingPrincipal -= principalPaid;
    amortization.push({
      month: i,
      emi: emi.toFixed(2),
      principalPaid: principalPaid.toFixed(2),
      interestPaid: interestPaid.toFixed(2),
      remainingBalance: remainingPrincipal.toFixed(2)
    });
  }

  // Enhanced CIBIL score logic
  let eligibleStatus = 'Not Eligible';
  let financePartners = ['HDFC Bank', 'SBI'];
  if (cibilScore > 800) {
    eligibleStatus = 'Highly Eligible';
    financePartners = ['HDFC Bank', 'SBI', 'Kotak Mahindra Bank', 'ICICI Bank'];
  } else if (cibilScore > 700) {
    eligibleStatus = 'Eligible';
    financePartners = ['HDFC Bank', 'SBI', 'Kotak Mahindra Bank'];
  } else if (cibilScore > 650) {
    eligibleStatus = 'Conditionally Eligible';
    financePartners = ['SBI'];
  } else {
    eligibleStatus = 'Not Eligible';
    financePartners = [];
  }

  res.json({ emi: emi.toFixed(2), totalInterest: totalInterest.toFixed(2), amortization, eligible: eligibleStatus, financePartners });
};