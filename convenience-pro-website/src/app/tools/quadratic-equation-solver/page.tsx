import { QuadraticEquationSolver } from '@/components/tools/quadratic-equation-solver';

export const metadata = {
  title: 'Quadratic Equation Solver | Solve ax² + bx + c = 0 Online',
  description: 'Free quadratic equation solver with step-by-step solutions. Calculate discriminant, find real and complex roots, visualize parabola graph. Solve ax² + bx + c = 0 instantly.',
  keywords: ['quadratic equation solver', 'quadratic formula', 'solve quadratic equation', 'discriminant calculator', 'find roots', 'parabola graph', 'complex roots', 'ax2 + bx + c'],
  openGraph: {
    title: 'Quadratic Equation Solver | Solve ax² + bx + c = 0 Online',
    description: 'Free quadratic equation solver with step-by-step solutions. Calculate discriminant, find real and complex roots, visualize parabola graph.',
    type: 'website',
    url: '/tools/quadratic-equation-solver',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quadratic Equation Solver | Solve ax² + bx + c = 0 Online',
    description: 'Free quadratic equation solver with step-by-step solutions. Calculate discriminant, find real and complex roots, visualize parabola graph.',
  },
};

export default function QuadraticEquationSolverPage() {
  return <QuadraticEquationSolver />;
}
