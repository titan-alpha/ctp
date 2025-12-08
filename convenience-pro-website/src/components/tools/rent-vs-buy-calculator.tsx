'use client';

import { useState } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useRentVsBuyCalculator } from '@/hooks/useRentVsBuyCalculator';

const FEATURES = [
  {
    title: 'Multi-Year Projections',
    description: 'See detailed year-by-year comparisons of rent vs buy costs, home equity, and investment growth over your timeline.',
  },
  {
    title: 'Tax Benefits Included',
    description: 'Automatically factors in mortgage interest and property tax deductions based on your marginal tax rate.',
  },
  {
    title: 'Break-Even Analysis',
    description: 'Discover exactly when buying becomes more financially beneficial than renting based on your specific situation.',
  },
];

const FAQS = [
  {
    question: 'How does the rent vs buy calculator work?',
    answer: 'The calculator compares the total cost of renting versus buying over your specified time horizon. It factors in mortgage payments, property taxes, maintenance, appreciation, tax benefits, and investment returns on saved down payment funds.',
  },
  {
    question: 'What is the break-even point?',
    answer: 'The break-even point is when the net worth from buying (home equity minus selling costs) equals or exceeds the net worth from renting (invested savings). Before this point, renting is typically better financially.',
  },
  {
    question: 'How long should I plan to stay to make buying worthwhile?',
    answer: 'Generally, buying makes more sense if you plan to stay 5-7+ years. This allows time to build equity, offset closing costs, and benefit from appreciation. Short-term ownership often favors renting.',
  },
  {
    question: 'What costs are included in the buying calculation?',
    answer: 'The calculator includes down payment, closing costs, monthly mortgage (principal & interest), property taxes, homeowners insurance, maintenance costs, HOA fees, and selling costs when you move.',
  },
  {
    question: 'How are tax benefits calculated?',
    answer: 'Tax benefits are calculated by multiplying your mortgage interest and property tax payments by your marginal tax rate. This assumes you itemize deductions rather than taking the standard deduction.',
  },
  {
    question: 'What investment return rate should I use?',
    answer: 'A conservative estimate is 6-7% for a diversified stock portfolio. Use a lower rate (3-4%) if you prefer safer investments, or higher (8-10%) if you have a higher risk tolerance.',
  },
];

export function RentVsBuyCalculator() {
  const { result, calculate, reset } = useRentVsBuyCalculator();

  // Rent inputs
  const [monthlyRent, setMonthlyRent] = useState('2000');
  const [annualRentIncrease, setAnnualRentIncrease] = useState('3');
  const [rentersInsurance, setRentersInsurance] = useState('200');

  // Buy inputs
  const [homePrice, setHomePrice] = useState('400000');
  const [downPaymentPercent, setDownPaymentPercent] = useState('20');
  const [interestRate, setInterestRate] = useState('7');
  const [loanTermYears, setLoanTermYears] = useState('30');
  const [propertyTaxRate, setPropertyTaxRate] = useState('1.2');
  const [homeInsurance, setHomeInsurance] = useState('1500');
  const [maintenancePercent, setMaintenancePercent] = useState('1');
  const [hoaFees, setHoaFees] = useState('0');
  const [appreciationRate, setAppreciationRate] = useState('3');
  const [closingCostPercent, setClosingCostPercent] = useState('3');
  const [sellingCostPercent, setSellingCostPercent] = useState('6');
  const [marginalTaxRate, setMarginalTaxRate] = useState('22');

  // Timeline & investment
  const [yearsToStay, setYearsToStay] = useState(7);
  const [investmentReturnRate, setInvestmentReturnRate] = useState('7');

  const handleCalculate = () => {
    calculate({
      rent: {
        monthlyRent: parseFloat(monthlyRent) || 0,
        annualRentIncrease: parseFloat(annualRentIncrease) || 0,
        rentersInsurance: parseFloat(rentersInsurance) || 0,
      },
      buy: {
        homePrice: parseFloat(homePrice) || 0,
        downPaymentPercent: parseFloat(downPaymentPercent) || 0,
        interestRate: parseFloat(interestRate) || 0,
        loanTermYears: parseInt(loanTermYears) || 30,
        propertyTaxRate: parseFloat(propertyTaxRate) || 0,
        homeInsurance: parseFloat(homeInsurance) || 0,
        maintenancePercent: parseFloat(maintenancePercent) || 0,
        hoaFees: parseFloat(hoaFees) || 0,
        appreciationRate: parseFloat(appreciationRate) || 0,
        closingCostPercent: parseFloat(closingCostPercent) || 0,
        sellingCostPercent: parseFloat(sellingCostPercent) || 0,
        marginalTaxRate: parseFloat(marginalTaxRate) || 0,
      },
      yearsToStay,
      investmentReturnRate: parseFloat(investmentReturnRate) || 0,
    });
  };

  const handleReset = () => {
    reset();
    setMonthlyRent('2000');
    setAnnualRentIncrease('3');
    setRentersInsurance('200');
    setHomePrice('400000');
    setDownPaymentPercent('20');
    setInterestRate('7');
    setLoanTermYears('30');
    setPropertyTaxRate('1.2');
    setHomeInsurance('1500');
    setMaintenancePercent('1');
    setHoaFees('0');
    setAppreciationRate('3');
    setClosingCostPercent('3');
    setSellingCostPercent('6');
    setMarginalTaxRate('22');
    setYearsToStay(7);
    setInvestmentReturnRate('7');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Rent vs Buy Calculator',
    description: 'Compare the costs of renting versus buying a home with multi-year projections, tax benefits, and break-even analysis.',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const inputClass = "w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <SiteLayout toolName="Rent vs Buy Calculator" category="real-estate-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Compare Renting vs Buying
          </h2>

          {/* Timeline Slider */}
          <div className="mb-6">
            <label className={labelClass}>
              How long do you plan to stay? <span className="font-bold text-blue-600">{yearsToStay} years</span>
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={yearsToStay}
              onChange={(e) => setYearsToStay(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 year</span>
              <span>15 years</span>
              <span>30 years</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Rent Section */}
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-700 dark:text-orange-400 mb-4">Rent Scenario</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Monthly Rent ($)</label>
                  <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Annual Rent Increase (%)</label>
                  <input type="number" value={annualRentIncrease} onChange={(e) => setAnnualRentIncrease(e.target.value)} className={inputClass} step="0.1" />
                </div>
                <div>
                  <label className={labelClass}>Renters Insurance ($/year)</label>
                  <input type="number" value={rentersInsurance} onChange={(e) => setRentersInsurance(e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Investment Return Rate (%)</label>
                  <input type="number" value={investmentReturnRate} onChange={(e) => setInvestmentReturnRate(e.target.value)} className={inputClass} step="0.1" />
                </div>
              </div>
            </div>

            {/* Buy Section */}
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-4">Buy Scenario</h3>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Home Price ($)</label>
                  <input type="number" value={homePrice} onChange={(e) => setHomePrice(e.target.value)} className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>Down Payment (%)</label>
                    <input type="number" value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Interest Rate (%)</label>
                    <input type="number" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className={inputClass} step="0.125" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>Loan Term (years)</label>
                    <select value={loanTermYears} onChange={(e) => setLoanTermYears(e.target.value)} className={inputClass}>
                      <option value="15">15 years</option>
                      <option value="20">20 years</option>
                      <option value="30">30 years</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Property Tax (%)</label>
                    <input type="number" value={propertyTaxRate} onChange={(e) => setPropertyTaxRate(e.target.value)} className={inputClass} step="0.1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>Home Insurance ($/yr)</label>
                    <input type="number" value={homeInsurance} onChange={(e) => setHomeInsurance(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Maintenance (%/yr)</label>
                    <input type="number" value={maintenancePercent} onChange={(e) => setMaintenancePercent(e.target.value)} className={inputClass} step="0.1" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className={labelClass}>HOA Fees ($/mo)</label>
                    <input type="number" value={hoaFees} onChange={(e) => setHoaFees(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Appreciation (%/yr)</label>
                    <input type="number" value={appreciationRate} onChange={(e) => setAppreciationRate(e.target.value)} className={inputClass} step="0.1" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className={labelClass}>Closing (%)</label>
                    <input type="number" value={closingCostPercent} onChange={(e) => setClosingCostPercent(e.target.value)} className={inputClass} step="0.1" />
                  </div>
                  <div>
                    <label className={labelClass}>Selling (%)</label>
                    <input type="number" value={sellingCostPercent} onChange={(e) => setSellingCostPercent(e.target.value)} className={inputClass} step="0.1" />
                  </div>
                  <div>
                    <label className={labelClass}>Tax Rate (%)</label>
                    <input type="number" value={marginalTaxRate} onChange={(e) => setMarginalTaxRate(e.target.value)} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleCalculate}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Compare Rent vs Buy
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            {/* Recommendation Banner */}
            <div className={`p-4 rounded-lg mb-6 ${
              result.recommendation === 'buy' ? 'bg-green-100 dark:bg-green-900/30' :
              result.recommendation === 'rent' ? 'bg-orange-100 dark:bg-orange-900/30' :
              'bg-gray-100 dark:bg-gray-700'
            }`}>
              <h3 className={`text-xl font-bold ${
                result.recommendation === 'buy' ? 'text-green-700 dark:text-green-400' :
                result.recommendation === 'rent' ? 'text-orange-700 dark:text-orange-400' :
                'text-gray-700 dark:text-gray-300'
              }`}>
                {result.recommendation === 'buy' ? 'Recommendation: Buy' :
                 result.recommendation === 'rent' ? 'Recommendation: Rent' :
                 'Result: About Equal'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {result.recommendation === 'buy'
                  ? `Buying builds ${formatCurrency(result.netWorthDifference)} more in net worth over ${yearsToStay} years.`
                  : result.recommendation === 'rent'
                  ? `Renting and investing saves ${formatCurrency(Math.abs(result.netWorthDifference))} in net worth over ${yearsToStay} years.`
                  : `Both options result in similar net worth after ${yearsToStay} years.`}
              </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-sm text-orange-600 dark:text-orange-400">Rent Net Worth</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.rentNetWorth)}</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-sm text-green-600 dark:text-green-400">Buy Net Worth</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.buyNetWorth)}</div>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-gray-400">Monthly Mortgage</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(result.monthlyMortgage)}</div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-sm text-blue-600 dark:text-blue-400">Break-Even</div>
                <div className="text-xl font-bold text-gray-900 dark:text-white">
                  {result.breakEvenYear ? `Year ${result.breakEvenYear}` : 'N/A'}
                </div>
              </div>
            </div>

            {/* Comparison Chart */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Net Worth Over Time</h4>
              <div className="overflow-x-auto">
                <div className="min-w-full h-64 relative bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex h-full items-end gap-1">
                    {result.projections.map((proj, idx) => {
                      const maxValue = Math.max(
                        ...result.projections.map(p => Math.max(p.rentNetWorth, p.buyNetWorth))
                      );
                      const rentHeight = (proj.rentNetWorth / maxValue) * 100;
                      const buyHeight = (proj.buyNetWorth / maxValue) * 100;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1" style={{ minWidth: '30px' }}>
                          <div className="flex gap-0.5 h-48 items-end w-full">
                            <div
                              className="flex-1 bg-orange-400 rounded-t"
                              style={{ height: `${Math.max(rentHeight, 2)}%` }}
                              title={`Rent: ${formatCurrency(proj.rentNetWorth)}`}
                            />
                            <div
                              className="flex-1 bg-green-500 rounded-t"
                              style={{ height: `${Math.max(buyHeight, 2)}%` }}
                              title={`Buy: ${formatCurrency(proj.buyNetWorth)}`}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{proj.year}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-400 rounded" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rent Net Worth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Buy Net Worth</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Break-Even Analysis */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Cost Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Total Rent Paid</span>
                    <span className="font-medium">{formatCurrency(result.totalRentCost)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">Investment Value</span>
                    <span className="font-medium">{formatCurrency(result.rentNetWorth)}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Down Payment + Closing</span>
                    <span className="font-medium">{formatCurrency(result.downPayment + result.closingCosts)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Total Buy Costs</span>
                    <span className="font-medium">{formatCurrency(result.totalBuyCost)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600 dark:text-gray-400">Home Equity (after selling)</span>
                    <span className="font-medium">{formatCurrency(result.buyNetWorth)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {FEATURES.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
