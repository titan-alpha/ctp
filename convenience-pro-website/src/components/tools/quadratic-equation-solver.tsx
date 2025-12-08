'use client';

import { useState, useEffect, useRef } from 'react';
import { SiteLayout } from '@/components/layout/site-layout';
import { SchemaMarkup } from '@/components/schema-markup';
import { useQuadraticEquationSolver, ComplexNumber } from '@/hooks/useQuadraticEquationSolver';

const FEATURES = [
  {
    title: 'Real & Complex Roots',
    description: 'Automatically detects and calculates both real and complex roots based on the discriminant value.',
  },
  {
    title: 'Step-by-Step Solution',
    description: 'See the complete solution process with detailed explanations at each step of the calculation.',
  },
  {
    title: 'Interactive Graph',
    description: 'Visualize the parabola with roots, vertex, and axis of symmetry clearly marked on the graph.',
  },
];

const FAQS = [
  {
    question: 'What is a quadratic equation?',
    answer: 'A quadratic equation is a polynomial equation of degree 2, written in the form ax² + bx + c = 0, where a, b, and c are constants and a ≠ 0. The solutions are called roots.',
  },
  {
    question: 'What is the discriminant?',
    answer: 'The discriminant (D = b² - 4ac) determines the nature of roots. If D > 0, there are two distinct real roots. If D = 0, there is one repeated real root. If D < 0, there are two complex conjugate roots.',
  },
  {
    question: 'What is the quadratic formula?',
    answer: 'The quadratic formula x = (-b ± √(b² - 4ac)) / 2a gives the solutions to any quadratic equation ax² + bx + c = 0.',
  },
  {
    question: 'What are complex roots?',
    answer: 'Complex roots occur when the discriminant is negative. They come in conjugate pairs (a + bi and a - bi) where i is the imaginary unit (√-1).',
  },
  {
    question: 'What is the vertex of a parabola?',
    answer: 'The vertex is the highest or lowest point of the parabola. Its x-coordinate is -b/(2a), which is also the axis of symmetry. If a > 0, the vertex is a minimum; if a < 0, it is a maximum.',
  },
  {
    question: 'Why can\'t coefficient a be zero?',
    answer: 'If a = 0, the equation becomes linear (bx + c = 0), not quadratic. A quadratic equation must have a non-zero coefficient for the x² term.',
  },
];

function formatNumber(num: number): string {
  if (Number.isInteger(num)) return num.toString();
  return num.toFixed(4).replace(/\.?0+$/, '');
}

function formatRoot(root: number | ComplexNumber): string {
  if (typeof root === 'number') {
    return formatNumber(root);
  }
  const real = formatNumber(root.real);
  const imag = formatNumber(Math.abs(root.imaginary));
  if (root.imaginary >= 0) {
    return `${real} + ${imag}i`;
  }
  return `${real} - ${imag}i`;
}

export function QuadraticEquationSolver() {
  const { result, error, solve, reset } = useQuadraticEquationSolver();
  const [a, setA] = useState('1');
  const [b, setB] = useState('0');
  const [c, setC] = useState('0');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSolve = () => {
    const aNum = parseFloat(a);
    const bNum = parseFloat(b);
    const cNum = parseFloat(c);
    solve(aNum, bNum, cNum);
  };

  const handleReset = () => {
    reset();
    setA('1');
    setB('0');
    setC('0');
  };

  // Draw graph
  useEffect(() => {
    if (!result || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const { a: aCoef, b: bCoef, c: cCoef, vertex, roots } = result;

    ctx.clearRect(0, 0, width, height);

    // Calculate scale
    const padding = 40;
    const graphWidth = width - 2 * padding;
    const graphHeight = height - 2 * padding;

    // Determine x range based on roots and vertex
    let xMin = vertex.x - 5;
    let xMax = vertex.x + 5;

    if (roots.type === 'real') {
      const x1 = roots.x1 as number;
      const x2 = roots.x2 as number;
      xMin = Math.min(xMin, x1 - 2, x2 - 2);
      xMax = Math.max(xMax, x1 + 2, x2 + 2);
    }

    // Calculate y values for range
    const yValues: number[] = [];
    for (let i = 0; i <= 100; i++) {
      const x = xMin + (xMax - xMin) * i / 100;
      yValues.push(aCoef * x * x + bCoef * x + cCoef);
    }
    let yMin = Math.min(...yValues, 0);
    let yMax = Math.max(...yValues, 0);

    // Add padding to y range
    const yPadding = (yMax - yMin) * 0.1;
    yMin -= yPadding;
    yMax += yPadding;

    const scaleX = graphWidth / (xMax - xMin);
    const scaleY = graphHeight / (yMax - yMin);

    const toCanvasX = (x: number) => padding + (x - xMin) * scaleX;
    const toCanvasY = (y: number) => height - padding - (y - yMin) * scaleY;

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(x), padding);
      ctx.lineTo(toCanvasX(x), height - padding);
      ctx.stroke();
    }

    // Horizontal grid lines
    const yStep = Math.ceil((yMax - yMin) / 10);
    for (let y = Math.ceil(yMin); y <= Math.floor(yMax); y += yStep || 1) {
      ctx.beginPath();
      ctx.moveTo(padding, toCanvasY(y));
      ctx.lineTo(width - padding, toCanvasY(y));
      ctx.stroke();
    }

    // Draw axes
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;

    // X-axis
    if (yMin <= 0 && yMax >= 0) {
      ctx.beginPath();
      ctx.moveTo(padding, toCanvasY(0));
      ctx.lineTo(width - padding, toCanvasY(0));
      ctx.stroke();
    }

    // Y-axis
    if (xMin <= 0 && xMax >= 0) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(0), padding);
      ctx.lineTo(toCanvasX(0), height - padding);
      ctx.stroke();
    }

    // Draw parabola
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let firstPoint = true;
    for (let i = 0; i <= 200; i++) {
      const x = xMin + (xMax - xMin) * i / 200;
      const y = aCoef * x * x + bCoef * x + cCoef;
      const canvasX = toCanvasX(x);
      const canvasY = toCanvasY(y);

      if (canvasY >= padding && canvasY <= height - padding) {
        if (firstPoint) {
          ctx.moveTo(canvasX, canvasY);
          firstPoint = false;
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      }
    }
    ctx.stroke();

    // Draw vertex
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(toCanvasX(vertex.x), toCanvasY(vertex.y), 6, 0, 2 * Math.PI);
    ctx.fill();

    // Draw axis of symmetry
    ctx.strokeStyle = '#10b981';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(toCanvasX(vertex.x), padding);
    ctx.lineTo(toCanvasX(vertex.x), height - padding);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw roots
    if (roots.type === 'real') {
      ctx.fillStyle = '#ef4444';
      const x1 = roots.x1 as number;
      const x2 = roots.x2 as number;

      ctx.beginPath();
      ctx.arc(toCanvasX(x1), toCanvasY(0), 6, 0, 2 * Math.PI);
      ctx.fill();

      if (x1 !== x2) {
        ctx.beginPath();
        ctx.arc(toCanvasX(x2), toCanvasY(0), 6, 0, 2 * Math.PI);
        ctx.fill();
      }
    }

    // Draw labels
    ctx.fillStyle = '#374151';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';

    // X-axis label
    ctx.fillText('x', width - padding + 15, toCanvasY(0) + 4);

    // Y-axis label
    ctx.fillText('y', toCanvasX(0), padding - 10);

  }, [result]);

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Quadratic Equation Solver',
    description: 'Solve quadratic equations ax² + bx + c = 0 with step-by-step solutions, discriminant analysis, and graph visualization.',
    applicationCategory: 'EducationalApplication',
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
    <SiteLayout toolName="Quadratic Equation Solver" category="education-tools">
      <SchemaMarkup schema={softwareSchema} />
      <SchemaMarkup schema={faqSchema} />

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Solve ax² + bx + c = 0
          </h2>

          {/* Coefficient Inputs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                a (coefficient of x²)
              </label>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                step="any"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                b (coefficient of x)
              </label>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                step="any"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                c (constant)
              </label>
              <input
                type="number"
                value={c}
                onChange={(e) => setC(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                step="any"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSolve}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Solve
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
          <>
            {/* Roots Display */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Solution
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Discriminant (D)</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(result.discriminant)}
                  </p>
                  <p className={`text-sm mt-1 ${
                    result.discriminantType === 'positive' ? 'text-green-600 dark:text-green-400' :
                    result.discriminantType === 'zero' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-purple-600 dark:text-purple-400'
                  }`}>
                    {result.discriminantType === 'positive' && 'Two distinct real roots'}
                    {result.discriminantType === 'zero' && 'One repeated real root'}
                    {result.discriminantType === 'negative' && 'Two complex conjugate roots'}
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Roots</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                    x₁ = {formatRoot(result.roots.x1)}
                  </p>
                  {result.discriminantType !== 'zero' && (
                    <p className="text-xl font-bold text-gray-900 dark:text-white font-mono">
                      x₂ = {formatRoot(result.roots.x2)}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Vertex</p>
                  <p className="font-mono text-gray-900 dark:text-white">
                    ({formatNumber(result.vertex.x)}, {formatNumber(result.vertex.y)})
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Axis of Symmetry</p>
                  <p className="font-mono text-gray-900 dark:text-white">
                    x = {formatNumber(result.axisOfSymmetry)}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Y-Intercept</p>
                  <p className="font-mono text-gray-900 dark:text-white">
                    (0, {formatNumber(result.yIntercept)})
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Solution */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Step-by-Step Solution
              </h3>
              <div className="space-y-4">
                {result.steps.map((step) => (
                  <div
                    key={step.step}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full text-sm font-bold">
                        {step.step}
                      </span>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {step.description}
                      </h4>
                    </div>
                    <div className="ml-11">
                      <p className="font-mono text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 px-3 py-2 rounded">
                        {step.formula}
                      </p>
                      <p className="mt-2 text-gray-600 dark:text-gray-400">
                        {step.result}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Graph Visualization */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Graph
              </h3>
              <div className="flex justify-center">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={400}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white"
                />
              </div>
              <div className="flex justify-center gap-6 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                  <span className="text-gray-600 dark:text-gray-400">Parabola</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="text-gray-600 dark:text-gray-400">Roots</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-gray-600 dark:text-gray-400">Vertex</span>
                </div>
              </div>
            </div>
          </>
        )}

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
