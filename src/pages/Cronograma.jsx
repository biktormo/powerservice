import React from 'react';
import { Gantt, ViewMode } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
import { planesAccionData } from './data.js';

export const Cronograma = () => {
  // Transformar datos para Gantt
  const tasks = planesAccionData.map((plan, index) => {
    const start = new Date(plan.startDate);
    const end = new Date(plan.endDate);
    
    // Ajuste para evitar errores si las fechas son iguales
    if (end.getTime() <= start.getTime()) {
        end.setDate(start.getDate() + 1);
    }

    return {
      start: start,
      end: end,
      name: `${plan.reqId} - ${plan.action}`,
      id: `task-${index}`,
      type: 'task',
      progress: plan.status === 'Completado' ? 100 : plan.status === 'En Progreso' ? 50 : 0,
      isDisabled: true,
      styles: { 
        progressColor: '#367C2B', 
        progressSelectedColor: '#2a6022',
        backgroundColor: '#FFDE00',
        backgroundSelectedColor: '#e6c800'
      },
    };
  });

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-end bg-white p-6 rounded-xl shadow-sm border-l-4 border-jd-green">
         <div>
            <h2 className="text-2xl font-bold text-jd-green">Cronograma de Implementación</h2>
            <p className="text-gray-500 text-sm">Vista temporal de los planes de acción</p>
         </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1 p-4">
        {tasks.length > 0 ? (
          <div className="h-full w-full overflow-auto">
            <Gantt
                tasks={tasks}
                viewMode={ViewMode.Month}
                locale="es"
                columnWidth={65}
                listCellWidth="300px"
                barBackgroundColor="#F3F4F6"
                barFill={80}
                barCornerRadius={4}
                fontFamily="Inter, sans-serif"
                fontSize="12px"
                headerHeight={50}
                rowHeight={50}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
             No hay tareas programadas para mostrar.
          </div>
        )}
      </div>
    </div>
  );
};