import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Requisitos } from './pages/Requisitos';
import { PlanesAccion } from './pages/PlanesAccion';
import { Cronograma } from './pages/Cronograma';
import { KPIs } from './pages/KPIs';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Requisitos />} />
          <Route path="planes" element={<PlanesAccion />} />
          <Route path="cronograma" element={<Cronograma />} />
          <Route path="kpis" element={<KPIs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;