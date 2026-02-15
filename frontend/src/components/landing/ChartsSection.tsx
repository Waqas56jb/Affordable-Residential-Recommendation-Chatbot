import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const safetyData = [
  { name: 'Area A', safety: 92, cost: 650 },
  { name: 'Area B', safety: 88, cost: 520 },
  { name: 'Area C', safety: 95, cost: 720 },
  { name: 'Area D', safety: 85, cost: 480 },
  { name: 'Area E', safety: 90, cost: 600 },
]

const facilityPie = [
  { name: 'Halal food', value: 24, color: '#44D7B6' },
  { name: 'Transport', value: 22, color: '#14b8a6' },
  { name: 'Gyms & parks', value: 18, color: '#0d9488' },
  { name: 'Masjids', value: 16, color: '#0f766e' },
  { name: 'Shopping', value: 20, color: '#115e59' },
]

export function ChartsSection() {
  return (
    <section className="py-16 lg:py-24 bg-primary-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">
            Real-time insights & KPIs
          </h2>
          <p className="text-black max-w-2xl mx-auto">
            Compare safety scores and monthly cost by area. See what matters most to students: food, transport, and facilities.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 border-2 border-primary-100 shadow-xl shadow-primary-100/40"
          >
            <h3 className="text-lg font-bold text-black mb-4">Safety index vs monthly cost (sample)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={safetyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fill: '#374151', fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fill: '#374151', fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: '#374151', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #99f6e4' }}
                    formatter={(value: number, name: string) => [name === 'safety' ? `${value}%` : `£${value}`, name === 'safety' ? 'Safety' : 'Rent']}
                  />
                  <Bar yAxisId="left" dataKey="safety" fill="#44D7B6" radius={[4, 4, 0, 0]} name="Safety %" />
                  <Bar yAxisId="right" dataKey="cost" fill="#0d9488" radius={[4, 4, 0, 0]} name="Rent £" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 border-2 border-primary-100 shadow-xl shadow-primary-100/40"
          >
            <h3 className="text-lg font-bold text-black mb-4">What students look for (facilities)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={facilityPie}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {facilityPie.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-8 text-center text-sm text-black"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-100 text-black">
            📍 GPS-based distance and live data when you search
          </span>
        </motion.div>
      </div>
    </section>
  )
}
