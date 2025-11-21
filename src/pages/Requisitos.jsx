import React, { useState } from 'react';
import { requisitosData } from './data.js';
import { Search, ChevronDown, ChevronRight, Bookmark } from 'lucide-react';
import { writeBatch, doc, collection } from "firebase/firestore";
import { db } from "../firebase";

export const Requisitos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedPillar, setExpandedPillar] = useState(null);

  // Agrupar requisitos por Pilar
  const groupedReqs = requisitosData.reduce((acc, req) => {
    if (!acc[req.pillar]) acc[req.pillar] = [];
    acc[req.pillar].push(req);
    return acc;
  }, {});

  const togglePillar = (pillar) => {
    setExpandedPillar(expandedPillar === pillar ? null : pillar);
  };

  const subirDatosAFirebase = async () => {
    if (!confirm("¿Estás seguro de subir los datos? Esto sobrescribirá la base de datos.")) return;
    
    try {
      const batch = writeBatch(db);
      
      // 1. Subir Requisitos
      requisitosData.forEach((req) => {
        const docRef = doc(db, "requisitos", req.id); // Usamos el ID (IS.1.1) como llave
        batch.set(docRef, req);
      });
  
      // 2. Subir Planes de Acción
      // Para los planes, generaremos un ID único automático o usaremos reqId si es 1 a 1.
      // Como puede haber varios planes para un requisito, mejor dejamos que Firestore genere el ID, 
      // pero guardamos el reqId dentro del documento para relacionarlos.
      planesAccionData.forEach((plan) => {
        const docRef = doc(collection(db, "planes"));
        batch.set(docRef, plan);
      });
  
      await batch.commit();
      alert("¡Datos subidos a la nube con éxito!");
    } catch (error) {
      console.error("Error subiendo datos:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border-l-4 border-jd-yellow">
        <div>
          <h2 className="text-2xl font-bold text-jd-green">Requisitos Operacionales</h2>

          <button onClick={subirDatosAFirebase} className="bg-red-500 text-white px-4 py-2 rounded mb-4 text-xs">
            ADMIN: Subir Datos Iniciales a DB
          </button>
          
          <p className="text-gray-500 text-sm mt-1">Estándares del programa Power Service</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Buscar (ej: IS.1.1, Uniformes...)"
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jd-green focus:border-transparent outline-none transition-all"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(groupedReqs).map(([pillar, reqs]) => {
          const filteredReqs = reqs.filter(r => 
            r.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
            r.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            r.standard.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (filteredReqs.length === 0) return null;

          const isOpen = expandedPillar === pillar || searchTerm.length > 0;

          return (
            <div key={pillar} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
              <button 
                onClick={() => togglePillar(pillar)}
                className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors border-b border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="text-jd-green fill-jd-green" size={20} />
                  <span className="font-bold text-gray-800 text-lg text-left">{pillar}</span>
                </div>
                {isOpen ? <ChevronDown className="text-jd-green"/> : <ChevronRight className="text-gray-400"/>}
              </button>
              
              {isOpen && (
                <div className="divide-y divide-gray-100 bg-gray-50/50">
                  {filteredReqs.map((req) => (
                    <div key={req.id} className="p-5 hover:bg-white transition-colors group border-l-4 border-transparent hover:border-jd-green pl-4">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <span className="inline-block bg-jd-green text-white text-xs font-bold px-3 py-1 rounded shadow-sm">
                            {req.id}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1 group-hover:text-jd-green transition-colors">
                            {req.standard}
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed text-justify">
                            {req.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};