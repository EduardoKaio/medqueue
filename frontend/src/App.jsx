import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PacienteList from './pages/Admin/PacienteList';
import PacienteCreate from './pages/Admin/PacienteCreate';
import PacienteEdit from './pages/Admin/PacienteEdit';
import Home from './pages/Home';
import Dashboard from './pages/Admin/Dashboard';
import FilaList from './pages/Admin/Filalist';
import FilaCreate from './pages/Admin/FilaCreate';
import FilaPacientesList from './pages/Admin/FilaPacienteList';
import Register from './pages/auth/Register';
import LoginPage from './pages/auth/Login';
import TriagemInteligente from './pages/Paciente/TriagemInteligente';
import HomePaciente from './pages/Paciente/HomePaciente';

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/paciente" element={<PrivateRoute element={<HomePaciente />}/>} />
        <Route path="/paciente/triagem" element={<TriagemInteligente />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/admin/pacientes" element={<PacienteList />} />
        <Route path="/admin/pacientes/create" element={<PacienteCreate />} />
        <Route path="/admin/pacientes/edit/:id" element={<PacienteEdit />} />
        <Route path="/admin/filas" element={<FilaList />} />
        <Route path="/admin/filas/create" element={<FilaCreate />} />
        <Route path="/admin/filas/:id" element={<FilaPacientesList />} />
        
        {/* Authentication Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
