import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, addDoc, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { requisitosData } from './data.js'; 
import { User, Plus, Save, Calendar, FileText, Loader2, Search, AlertCircle, CheckCircle2, Clock } from 'lucide-react';

const STATUS_COLORS = {
  'Completado': 'bg-green-100 text-green-800 border-green-200',
  'En Progreso': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  'Pendiente': 'bg-gray-100 text-gray-800 border-gray-200',
  'Atrasado': 'bg-red-100 text-red-800 border-red-200',
};

export const PlanesAccion = () => {
  // Estado
  const [allPlans, setAllPlans] = useState([]); // Todos los planes de la DB
  const [selectedReq, setSelectedReq] = useState(null); // El Requisito seleccionado (del archivo estático)
  const [editingAction, setEditingAction] = useState(null); // La acción que se está editando o creando
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Cargar planes de Firebase
  useEffect(() => {
    const q = query(collection(db, "planes"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const planesFetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAllPlans(planesFetched);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Filtros para la lista izquierda
  const filteredReqs = requisitosData.filter(req => 
    req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.standard.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Acciones del requisito seleccionado
  const currentActions = selectedReq 
    ? allPlans.filter(plan => plan.reqId === selectedReq.id)
    : [];

  // Manejadores
  const handleNewAction = () => {
    setEditingAction({
      reqId: selectedReq.id, // Vinculamos al requisito actual
      action: "",
      responsible: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      status: "Pendiente",
      comments: ""
    });
  };

  const handleEditAction = (plan) => {
    setEditingAction(plan);
  };

  const handleSave = async () => {
    if (!editingAction.action) return alert("Describe la acción");
    setIsSaving(true);
    try {
      if (editingAction.id) {
        // Actualizar existente
        const planRef = doc(db, "planes", editingAction.id);
        await updateDoc(planRef, { ...editingAction });
      } else {
        // Crear nuevo
        await addDoc(collection(db, "planes"), { ...editingAction });
      }
      setEditingAction(null); // Cerrar formulario
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin text-jd-green" size={48}/></div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
      
      {/* IZQUIERDA: Lista de Requisitos (Standards) */}
      <div className="w-full lg:w-4/12 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-jd-green text-white">
          <h3 className="font-bold text-lg">Seleccionar Requisito</h3>
          <p className="text-green-100 text-xs mb-3">Elige uno para ver o crear planes</p>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <input 
              type="text"
              placeholder="Buscar (ej: IS.1.1)..."
              className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-green-100 focus:outline-none focus:bg-white/20 transition-colors"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1">
          {filteredReqs.map((req) => {
            // Verificamos si este requisito tiene planes activos en la DB
            const hasPlans = allPlans.some(p => p.reqId === req.id);
            const isSelected = selectedReq?.id === req.id;

            return (
              <div 
                key={req.id}
                onClick={() => { setSelectedReq(req); setEditingAction(null); }}
                className={`p-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 flex justify-between items-center ${isSelected ? 'bg-green-50 border-l-4 border-l-jd-green' : ''}`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${isSelected ? 'bg-jd-green text-white' : 'bg-gray-200 text-gray-600'}`}>
                      {req.id}
                    </span>
                    {hasPlans && <span className="flex h-2 w-2 rounded-full bg-jd-yellow"></span>}
                  </div>
                  <p className={`text-sm mt-1 font-medium ${isSelected ? 'text-jd-green' : 'text-gray-600'}`}>
                    {req.standard}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DERECHA: Espacio de Trabajo */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden relative">
        {selectedReq ? (
          <div className="flex flex-col h-full">
            
            {/* 1. Info del Requisito */}
            <div className="bg-gray-50 p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-extrabold text-jd-black">{selectedReq.id}</h2>
                  <h3 className="text-jd-green font-bold">{selectedReq.standard}</h3>
                </div>
                {!editingAction && (
                  <button 
                    onClick={handleNewAction}
                    className="bg-jd-green text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-green-800 transition-all shadow-sm"
                  >
                    <Plus size={18} /> Agregar Acción
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-3 whitespace-pre-line leading-relaxed">{selectedReq.description}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
              
              {/* MODO EDICIÓN / CREACIÓN */}
              {editingAction ? (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center mb-6">
                    <h4 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                      {editingAction.id ? 'Editar Plan de Acción' : 'Nueva Acción Correctiva'}
                    </h4>
                    <button onClick={() => setEditingAction(null)} className="text-gray-400 hover:text-gray-600 text-sm underline">Cancelar</button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Acción a realizar</label>
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jd-green outline-none"
                        rows="2"
                        autoFocus
                        value={editingAction.action}
                        onChange={e => setEditingAction({...editingAction, action: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Responsable</label>
                        <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3">
                          <User size={16} className="text-gray-400 mr-2"/>
                          <input 
                            type="text" 
                            className="w-full py-2 text-sm outline-none"
                            value={editingAction.responsible}
                            onChange={e => setEditingAction({...editingAction, responsible: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Estado</label>
                        <select 
                          className="w-full p-2 bg-white border border-gray-300 rounded-lg text-sm outline-none"
                          value={editingAction.status}
                          onChange={e => setEditingAction({...editingAction, status: e.target.value})}
                        >
                          <option>Pendiente</option>
                          <option>En Progreso</option>
                          <option>Completado</option>
                          <option>Atrasado</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Inicio</label>
                        <input 
                          type="date" 
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                          value={editingAction.startDate}
                          onChange={e => setEditingAction({...editingAction, startDate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fin Estimado</label>
                        <input 
                          type="date" 
                          className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                          value={editingAction.endDate}
                          onChange={e => setEditingAction({...editingAction, endDate: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Comentarios</label>
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                        rows="2"
                        value={editingAction.comments}
                        onChange={e => setEditingAction({...editingAction, comments: e.target.value})}
                      />
                    </div>

                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full bg-jd-yellow text-jd-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition-colors flex justify-center items-center gap-2"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                      Guardar Acción
                    </button>
                  </div>
                </div>
              ) : (
                // LISTA DE ACCIONES EXISTENTES
                <div className="space-y-4">
                  {currentActions.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 bg-white rounded-xl border border-dashed border-gray-300">
                      <Clock size={40} className="mx-auto mb-2 opacity-50"/>
                      <p>No hay planes de acción para este requisito.</p>
                      <button onClick={handleNewAction} className="text-jd-green font-bold hover:underline mt-2">Crear el primero</button>
                    </div>
                  ) : (
                    <>
                      <h4 className="font-bold text-gray-700 mb-2 ml-1">Acciones Registradas ({currentActions.length})</h4>
                      {currentActions.map(plan => (
                        <div 
                          key={plan.id} 
                          onClick={() => handleEditAction(plan)}
                          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-jd-green cursor-pointer transition-all group"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${STATUS_COLORS[plan.status]}`}>
                              {plan.status}
                            </span>
                            <div className="flex gap-2 text-xs text-gray-400">
                               <Calendar size={14}/> {plan.endDate}
                            </div>
                          </div>
                          <p className="text-gray-800 font-medium mb-2">{plan.action}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <User size={14}/> {plan.responsible || "Sin asignar"}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50/50">
            <div className="bg-white p-6 rounded-full shadow-sm mb-4 border border-gray-100">
               <FileText size={48} className="text-jd-green/50" />
            </div>
            <h3 className="text-lg font-bold text-gray-700">Selecciona un Requisito</h3>
            <p className="text-sm">Usa el menú de la izquierda para gestionar los planes.</p>
          </div>
        )}
      </div>
    </div>
  );
};