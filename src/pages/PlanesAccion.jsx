import React, { useState, useEffect } from 'react';
// Importamos funciones de Firebase
import { collection, onSnapshot, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { requisitosData } from './data.js'; // Mantenemos los requisitos estáticos por rendimiento, o podrías leerlos de firebase también
import { User, CheckCircle2, Upload, Save, Calendar, FileText, Loader2 } from 'lucide-react';

const STATUS_COLORS = {
  'Completado': 'bg-green-100 text-green-800 border-green-200',
  'En Progreso': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Pendiente': 'bg-gray-100 text-gray-800 border-gray-200',
  'Atrasado': 'bg-red-100 text-red-800 border-red-200',
};

export const PlanesAccion = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. LEER DATOS EN TIEMPO REAL
  useEffect(() => {
    // Escuchamos la colección "planes"
    const q = query(collection(db, "planes")); // Puedes agregar orderBy aqui
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const planesFetched = snapshot.docs.map(doc => ({
        id: doc.id, // ID de Firestore
        ...doc.data()
      }));
      setPlanes(planesFetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. GUARDAR CAMBIOS
  const handleSave = async () => {
    if (!selectedPlan) return;
    setIsSaving(true);
    try {
      const planRef = doc(db, "planes", selectedPlan.id);
      await updateDoc(planRef, {
        action: selectedPlan.action,
        status: selectedPlan.status,
        responsible: selectedPlan.responsible,
        startDate: selectedPlan.startDate,
        endDate: selectedPlan.endDate,
        comments: selectedPlan.comments || "",
        // evidence: selectedPlan.evidence // (Lo veremos en el paso de Storage)
      });
      alert("¡Cambios guardados correctamente!");
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };
  
  // Combinamos datos de Firestore con la descripción estática de los requisitos
  const planesCompletos = planes.map(plan => {
    const req = requisitosData.find(r => r.id === plan.reqId);
    return { ...plan, description: req?.description, standard: req?.standard };
  });

  // Función para actualizar el estado local mientras editamos
  const updateLocalField = (field, value) => {
    setSelectedPlan(prev => ({ ...prev, [field]: value }));
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-jd-green" size={48}/></div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      {/* Lista Lateral */}
      <div className="w-full lg:w-4/12 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">Lista de Acciones</h3>
          <span className="bg-jd-black text-white text-xs px-2 py-1 rounded font-bold">{planesCompletos.length}</span>
        </div>
        
        <div className="overflow-y-auto flex-1 p-3 space-y-2 bg-gray-50">
          {planesCompletos.map((plan) => (
            <div 
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedPlan?.id === plan.id 
                  ? 'border-jd-green bg-white ring-2 ring-jd-green shadow-lg relative z-10' 
                  : 'border-gray-200 bg-white hover:border-jd-green/50'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-sm text-jd-green bg-green-50 px-2 py-0.5 rounded">{plan.reqId}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${STATUS_COLORS[plan.status]}`}>
                  {plan.status}
                </span>
              </div>
              <p className="text-sm text-gray-800 font-medium mb-3 line-clamp-2">{plan.action}</p>
              <div className="flex items-center justify-between border-t pt-2 border-gray-100">
                 <div className="flex items-center gap-1 text-xs text-gray-500">
                    <User size={12} /> {plan.responsible}
                 </div>
                 <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} /> {plan.endDate}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Panel de Detalles */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
        {selectedPlan ? (
          <div className="flex flex-col h-full">
            {/* Cabecera Verde */}
            <div className="bg-jd-green p-6 text-white shadow-md z-10">
              <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-extrabold tracking-tight">{selectedPlan.reqId}</h2>
                  </div>
                  <p className="text-green-100 text-sm font-medium opacity-90">{selectedPlan.standard}</p>
                </div>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-jd-yellow text-jd-black px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-yellow-400 transition-all shadow-lg disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} 
                  {isSaving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
              
              {/* Descripción del Requisito */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                <FileText className="text-blue-600 flex-shrink-0 mt-0.5" size={20}/>
                <div>
                   <h4 className="text-xs font-bold text-blue-800 uppercase mb-1">Descripción del Requisito</h4>
                   <p className="text-sm text-blue-900 leading-relaxed">{selectedPlan.description}</p>
                </div>
              </div>

              {/* Campos del Formulario */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Acción Correctiva / Plan</label>
                  <textarea 
                    className="w-full p-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-jd-green outline-none shadow-sm"
                    rows="3"
                    value={selectedPlan.action}
                    onChange={(e) => updateLocalField('action', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Estado Actual</label>
                    <select 
                      className="w-full p-2.5 bg-white border border-gray-300 rounded-lg text-sm outline-none focus:border-jd-green shadow-sm"
                      value={selectedPlan.status}
                      onChange={(e) => updateLocalField('status', e.target.value)}
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En Progreso">En Progreso</option>
                      <option value="Completado">Completado</option>
                      <option value="Atrasado">Atrasado</option>
                    </select>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Responsable</label>
                    <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 shadow-sm focus-within:ring-1 focus-within:ring-jd-green">
                      <User size={18} className="text-gray-400 mr-2"/>
                      <input 
                        type="text" 
                        value={selectedPlan.responsible}
                        onChange={(e) => updateLocalField('responsible', e.target.value)}
                        className="w-full py-2.5 text-sm outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Inicio</label>
                    <input 
                      type="date" 
                      value={selectedPlan.startDate}
                      onChange={(e) => updateLocalField('startDate', e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fin Estimado</label>
                    <input 
                      type="date" 
                      value={selectedPlan.endDate}
                      onChange={(e) => updateLocalField('endDate', e.target.value)}
                      className="w-full p-2.5 border border-gray-300 rounded-lg text-sm shadow-sm"
                    />
                  </div>
                </div>

                {/* Evidencias - Visual (Funcionalidad en la próxima fase) */}
                <div>
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Evidencias</label>
                   <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-jd-green cursor-pointer transition-all">
                      <Upload size={24} className="mb-2"/>
                      <span className="text-sm">Subida de archivos próximamente...</span>
                   </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Comentarios / Bitácora</label>
                  <textarea 
                    className="w-full p-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-jd-green outline-none shadow-sm"
                    rows="3"
                    placeholder="Agregar notas..."
                    value={selectedPlan.comments || ""}
                    onChange={(e) => updateLocalField('comments', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4 border border-gray-100">
               <FileText size={48} className="text-jd-green/50" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">Ningún plan seleccionado</h3>
            <p className="text-sm">Selecciona un ítem de la lista izquierda para editar.</p>
          </div>
        )}
      </div>
    </div>
  );
};