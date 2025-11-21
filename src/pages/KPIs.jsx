import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { planesAccionData } from './data.js';

export const KPIs = () => {
  const total = planesAccionData.length;
  const statusCounts = planesAccionData.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.keys(statusCounts).map(key => ({
    name: key,
    value: statusCounts[key]
  }));

  const barData = [
    { name: 'IS', completado: 4, pendiente: 2 },
    { name: 'MS', completado: 3, pendiente: 4 },
    { name: 'VS', completado: 2, pendiente: 3 },
    { name: 'PA', completado: 5, pendiente: 1 },
  ];

  const COLORS = ['#367C2B', '#FFDE00', '#9CA3AF', '#EF4444'];

  return (
    <div className="space-y-6 pb-10">
      <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-jd-green">
        <h2 className="text-2xl font-bold text-jd-green">Tablero de Control (KPIs)</h2>
        <p className="text-gray-500 text-sm">Métricas de desempeño del programa</p>
      </div>
      
      {/* Tarjetas Superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-jd-green flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total</span>
          <p className="text-5xl font-extrabold text-jd-black mt-2">{total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-[#367C2B] flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Completados</span>
          <p className="text-5xl font-extrabold text-green-700 mt-2">{statusCounts['Completado'] || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-jd-yellow flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">En Progreso</span>
          <p className="text-5xl font-extrabold text-yellow-600 mt-2">{statusCounts['En Progreso'] || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-b-4 border-red-500 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Atrasados</span>
          <p className="text-5xl font-extrabold text-red-600 mt-2">{statusCounts['Atrasado'] || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-6 border-b pb-4 text-lg">Estado General de Planes</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Legend verticalAlign="bottom" height={36} iconType="circle"/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-6 border-b pb-4 text-lg">Progreso por Pilar</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} barSize={40}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
                <Tooltip cursor={{fill: '#F3F4F6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Legend iconType="circle" verticalAlign="top" wrapperStyle={{paddingBottom: '20px'}}/>
                <Bar dataKey="completado" name="Completado" stackId="a" fill="#367C2B" radius={[0, 0, 4, 4]} />
                <Bar dataKey="pendiente" name="Pendiente" stackId="a" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};