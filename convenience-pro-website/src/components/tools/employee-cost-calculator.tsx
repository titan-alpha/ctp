'use client';

import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useEmployeeCostCalculator } from '@/hooks/useEmployeeCostCalculator';

const FEATURES = [
  {
    title: 'Complete Cost Analysis',
    description: 'Calculate the true cost of employment including salary, benefits, taxes, and overhead expenses.',
  },
  {
    title: 'Tax Calculations',
    description: 'Automatically compute employer-paid taxes including Social Security, Medicare, FUTA, and SUTA.',
  },
  {
    title: 'Cost Multiplier',
    description: 'See how much more an employee costs beyond their base salary with the cost multiplier ratio.',
  },
];

const FAQS = [
  {
    question: 'What is the true cost of an employee?',
    answer: 'The true cost of an employee typically ranges from 1.25x to 1.4x their base salary. This includes benefits, employer taxes, and overhead costs like equipment, software, and office space.',
  },
  {
    question: 'What employer taxes are included?',
    answer: 'Employer taxes include Social Security (6.2%), Medicare (1.45%), Federal Unemployment (FUTA - 0.6%), State Unemployment (SUTA - varies by state), and Workers Compensation insurance.',
  },
  {
    question: 'How is PTO value calculated?',
    answer: 'PTO value is calculated by dividing the number of PTO days by 260 working days per year, then multiplying by the base salary. This represents the cost of paid time when the employee is not working.',
  },
  {
    question: 'What overhead costs should I include?',
    answer: 'Common overhead costs include computer equipment, software licenses, office space allocation, training and development, and any other per-employee expenses your company incurs.',
  },
  {
    question: 'Why is the cost multiplier important?',
    answer: 'The cost multiplier helps budget accurately for hiring. If your multiplier is 1.35x, a $60,000 salary actually costs $81,000 annually. This is crucial for financial planning and pricing services.',
  },
  {
    question: 'How accurate is this calculator?',
    answer: 'This calculator provides estimates based on typical US employment costs. Actual costs vary by state, industry, and company policies. Consult with HR or accounting for precise figures.',
  },
];

export function EmployeeCostCalculator() {
  const { inputs, updateInput, resetInputs, breakdown } = useEmployeeCostCalculator();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Employee Cost Calculator',
    description: 'Calculate the total cost of employment including salary, benefits, taxes, and overhead expenses.',
    applicationCategory: 'BusinessApplication',
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

  return (
    <SiteLayout toolName="Employee Cost Calculator" category="business-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        {/* Total Cost Display */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-blue-100 text-sm">Total Annual Cost</p>
              <p className="text-2xl font-bold">{formatCurrency(breakdown.totalCost)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Monthly Cost</p>
              <p className="text-2xl font-bold">{formatCurrency(breakdown.monthlyCost)}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Hourly Rate</p>
              <p className="text-2xl font-bold">{formatCurrency(breakdown.hourlyRate)}/hr</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Cost Multiplier</p>
              <p className="text-2xl font-bold">{breakdown.costMultiplier.toFixed(2)}x</p>
            </div>
          </div>
        </div>

        {/* Salary Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Base Salary
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Annual Base Salary ($)
            </label>
            <input
              type="number"
              value={inputs.baseSalary}
              onChange={(e) => updateInput('baseSalary', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Benefits Inputs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Health Insurance ($/year)
              </label>
              <input
                type="number"
                value={inputs.healthInsurance}
                onChange={(e) => updateInput('healthInsurance', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dental & Vision ($/year)
              </label>
              <input
                type="number"
                value={inputs.dentalVision}
                onChange={(e) => updateInput('dentalVision', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                401(k) Match (%)
              </label>
              <input
                type="number"
                value={inputs.retirement401k}
                onChange={(e) => updateInput('retirement401k', parseFloat(e.target.value) || 0)}
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Paid Time Off (days/year)
              </label>
              <input
                type="number"
                value={inputs.paidTimeOff}
                onChange={(e) => updateInput('paidTimeOff', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Tax Rates */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Employer Tax Rates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Social Security (%)
              </label>
              <input
                type="number"
                value={inputs.socialSecurityRate}
                onChange={(e) => updateInput('socialSecurityRate', parseFloat(e.target.value) || 0)}
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Medicare (%)
              </label>
              <input
                type="number"
                value={inputs.medicareRate}
                onChange={(e) => updateInput('medicareRate', parseFloat(e.target.value) || 0)}
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                FUTA (%)
              </label>
              <input
                type="number"
                value={inputs.federalUnemploymentRate}
                onChange={(e) => updateInput('federalUnemploymentRate', parseFloat(e.target.value) || 0)}
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                SUTA (%)
              </label>
              <input
                type="number"
                value={inputs.stateUnemploymentRate}
                onChange={(e) => updateInput('stateUnemploymentRate', parseFloat(e.target.value) || 0)}
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Workers Comp (%)
              </label>
              <input
                type="number"
                value={inputs.workersCompRate}
                onChange={(e) => updateInput('workersCompRate', parseFloat(e.target.value) || 0)}
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Overhead Costs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Overhead Costs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Equipment ($/year)
              </label>
              <input
                type="number"
                value={inputs.equipmentCost}
                onChange={(e) => updateInput('equipmentCost', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Software Licenses ($/year)
              </label>
              <input
                type="number"
                value={inputs.softwareLicenses}
                onChange={(e) => updateInput('softwareLicenses', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Office Space ($/year)
              </label>
              <input
                type="number"
                value={inputs.officeSpace}
                onChange={(e) => updateInput('officeSpace', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Training ($/year)
              </label>
              <input
                type="number"
                value={inputs.trainingCost}
                onChange={(e) => updateInput('trainingCost', parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={resetInputs}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Cost Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Base Salary</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(breakdown.baseSalary)}
              </p>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Benefits</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(breakdown.totalBenefits)}
              </p>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Employer Taxes</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(breakdown.totalTaxes)}
              </p>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="font-medium text-gray-900 dark:text-white">Overhead</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrency(breakdown.totalOverhead)}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <p className="text-xl font-bold text-gray-900 dark:text-white">Total Annual Cost</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatCurrency(breakdown.totalCost)}
              </p>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
            >
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
              <div
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0"
              >
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
