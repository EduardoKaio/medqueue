import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PacienteList from './pages/admin/PacienteList';
import PacienteCreate from './pages/admin/PacienteCreate';
import PacienteEdit from './pages/admin/PacienteEdit';
import Home from './pages/Home';
import Dashboard from './pages/admin/Dashboard';
import FilaList from './pages/admin/Filalist';
import FilaCreate from './pages/admin/FilaCreate';
import FilaPacientesList from './pages/admin/FilaPacienteList';
import Register from './pages/Register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/pacientes" element={<PacienteList />} />
        <Route path="/admin/pacientes/create" element={<PacienteCreate />} />
        <Route path="/admin/pacientes/edit/:id" element={<PacienteEdit />} />
        <Route path="/admin/filas" element={<FilaList />} />
        <Route path="/admin/filas/create" element={<FilaCreate />} />
        <Route path="/admin/filas/:id" element={<FilaPacientesList />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
