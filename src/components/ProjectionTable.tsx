import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import type { ProjectionYear } from '../types';
import { formatCurrency } from '../lib/formatters';

interface ProjectionChartProps {
  projections: ProjectionYear[];
  darkMode: boolean;
}

export default function ProjectionTable({ projections, darkMode }: ProjectionChartProps) {
  const chartData = projections.map((p) => ({
    name: `Yr ${p.year}`,
    fcf: p.fcf,
    pvFCF: p.pvFCF,
  }));

  const axisColor = darkMode ? '#e5e5e5' : '#1a1625';
  const gridColor = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const fcfColor = '#f59e0b';
  const pvColor = darkMode ? '#9d8df1' : '#7c6dd8';

  const compactFormat = (value: number) => formatCurrency(value, { compact: true });

  return (
    <div className="p-5 rounded-xl overflow-hidden
      bg-artemis-card dark:bg-artemis-dark-card
      border border-artemis-border dark:border-artemis-dark-border">

      <h3 className="text-lg font-bold mb-4 text-artemis-text dark:text-artemis-dark-text">
        Projected Free Cash Flows
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="name"
            tick={{ fill: axisColor, fontSize: 12 }}
            stroke={gridColor}
          />
          <YAxis
            tickFormatter={compactFormat}
            tick={{ fill: axisColor, fontSize: 12 }}
            stroke={gridColor}
            width={70}
          />
          <Tooltip
            formatter={(value?: number, name?: string) => [
              value != null ? compactFormat(value) : '',
              name ?? '',
            ]}
            contentStyle={{
              backgroundColor: darkMode ? '#3d3a5c' : '#ffffff',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}`,
              borderRadius: '8px',
              color: axisColor,
            }}
          />
          <Legend
            wrapperStyle={{ color: axisColor, fontSize: 13 }}
          />
          <Bar dataKey="fcf" name="FCF" fill={fcfColor} radius={[4, 4, 0, 0]} />
          <Bar dataKey="pvFCF" name="PV of FCF" fill={pvColor} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
