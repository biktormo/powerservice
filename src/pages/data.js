// src/data.js

export const requisitosData = [
  // IS - Infraestructura
  { id: "IS.1.1", pillar: "IS - Infraestructura y Soporte", standard: "IS.1 Identificación y Señalización", description: "Las identificaciones externas del Concesionario deben estar de acuerdo con el Manual MIV: fachadas, tótem y letreros limpios y visibles." },
  { id: "IS.1.2", pillar: "IS - Infraestructura y Soporte", standard: "IS.1 Identificación y Señalización", description: "Avisos de horario de atención y teléfonos de Postventa instalados en puerta principal." },
  { id: "IS.1.3", pillar: "IS - Infraestructura y Soporte", standard: "IS.1 Identificación y Señalización", description: "Plazas de aparcamiento exclusivas para Clientes en buen estado y señalizadas." },
  { id: "IS.1.4", pillar: "IS - Infraestructura y Soporte", standard: "IS.1 Identificación y Señalización", description: "Señales externas, pancartas y equipos de incendio en perfecto estado." },
  { id: "IS.2.1", pillar: "IS - Infraestructura y Soporte", standard: "IS.2 Identificación de Empleados", description: "Empleados debidamente uniformados según función y Manual MIV." },
  { id: "IS.3.1", pillar: "IS - Infraestructura y Soporte", standard: "IS.3 Equipos de Diagnóstico", description: "Técnicos con computadoras/laptops con acceso a portales JD (Service Advisor, DTAC)." },
  { id: "IS.3.2", pillar: "IS - Infraestructura y Soporte", standard: "IS.3 Equipos de Diagnóstico", description: "Computadoras cumplen requisitos de hardware para últimas versiones de Service Advisor." },
  
  // MS - Marketing
  { id: "MS.1.1", pillar: "MS - Marketing de Servicios", standard: "MS.1 Análisis de Perfil", description: "Registro de cliente actualizado (información personal y parque de maquinaria)." },
  { id: "MS.1.2", pillar: "MS - Marketing de Servicios", standard: "MS.1 Análisis de Perfil", description: "Análisis anual del Potencial de Compras de Servicios para clasificar perfil." },
  { id: "MS.2.1", pillar: "MS - Marketing de Servicios", standard: "MS.2 Análisis de Mercado", description: "Benchmarking anual con competencia (nivel servicio, precios, instalaciones)." },
  
  // VS - Ventas
  { id: "VS.1.1", pillar: "VS - Venta de Servicios", standard: "VS.1 Política de Servicios", description: "Desarrollar Política de Servicios con valores de mano de obra, traslados y descuentos." },
  { id: "VS.2.1", pillar: "VS - Venta de Servicios", standard: "VS.2 Plan de Metas", description: "Definir Objetivos de Ventas considerando potencial, capacidad técnica e histórico." },
  
  // PA - Programación
  { id: "PA.1.1", pillar: "PA - Programación y Apuntamiento", standard: "PA.1 Programación", description: "Análisis diario de servicios a apuntar en próximos 5 días (revisiones, garantías, etc)." },
  { id: "PA.3.1", pillar: "PA - Programación y Apuntamiento", standard: "PA.3 Atención SPOT", description: "Llamadas telefónicas atendidas antes del 3er timbre con script estándar." },

  // GT - Gestión Taller
  { id: "GT.1.1", pillar: "GT - Gestión del Taller", standard: "GT.1 5S", description: "Asegurar implementación de 5S y aplicar checklist mensualmente." }
];

export const planesAccionData = [
  {
    reqId: "IS.1.1",
    action: "Auditar: Relevamiento fotográfico señalización externa en Charata y Bandera",
    startDate: "2025-08-20",
    endDate: "2025-08-21",
    responsible: "Gerente Postventa",
    status: "Pendiente",
    evidence: [],
    comments: ""
  },
  {
    reqId: "IS.1.1",
    action: "Planificar Mantenimiento: Cronograma de limpieza semanal",
    startDate: "2025-10-14",
    endDate: "2025-10-21",
    responsible: "Responsable MKT",
    status: "Pendiente",
    evidence: [],
    comments: ""
  },
  {
    reqId: "IS.1.2",
    action: "Diseñar: Crear diseño de aviso estandarizado según MIV",
    startDate: "2025-09-01",
    endDate: "2025-09-15",
    responsible: "Administrativo Servicio",
    status: "En Progreso",
    evidence: [],
    comments: "Borrador enviado a aprobación."
  },
  {
    reqId: "IS.3.1",
    action: "Verificar Accesos: Chequeo de usuarios Service Advisor",
    startDate: "2025-10-20",
    endDate: "2025-10-24",
    responsible: "Jefe de Taller",
    status: "Completado",
    evidence: ["lista_usuarios_ok.pdf"],
    comments: "Todos operativos."
  },
  {
    reqId: "MS.1.1",
    action: "Revisar CRM y actualizar base de datos de maquinaria",
    startDate: "2025-11-01",
    endDate: "2025-11-30",
    responsible: "Rep. Comercial Servicios",
    status: "Atrasado",
    evidence: [],
    comments: "Falta información de la zona norte."
  }
];