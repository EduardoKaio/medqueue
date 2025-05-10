<<<<<<< Updated upstream
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
=======
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PacienteList from "./pages/admin/PacienteList";
import PacienteCreate from "./pages/admin/PacienteCreate";
import PacienteEdit from "./pages/admin/PacienteEdit";
import Home from "./pages/Home";
import Dashboard from "./pages/admin/Dashboard";
import FilaList from "./pages/admin/FilaList";
import FilaCreate from "./pages/admin/FilaCreate";
import FilaEdit from "./pages/admin/FilaEdit";
import FilaPacientesList from "./pages/admin/FilaPacienteList";
import Register from "./pages/auth/Register";
import LoginPage from "./pages/auth/Login";
import TriagemInteligente from "./pages/paciente/TriagemInteligente";
import HomePaciente from "./pages/paciente/HomePaciente";

import PrivateRoute from "./components/PrivateRoute";
import HeaderLayout from "./components/HeaderLayout";
import FilaAtual from "./pages/paciente/FilaAtual";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
=======

        <Route element={<PrivateRoute />}>
          {/* Admin Routes  */}
          <Route path="/admin/" element={<HeaderLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pacientes" element={<PacienteList />} />
            <Route path="pacientes/create" element={<PacienteCreate />} />
            <Route path="pacientes/edit/:id" element={<PacienteEdit />} />
            <Route path="filas" element={<FilaList />} />
            <Route path="filas/create" element={<FilaCreate />} />
            <Route path="filas/edit/:id" element={<FilaEdit />} />{" "}
            <Route path="filas/:id" element={<FilaPacientesList />} />
          </Route>

          {/* Pacient Routes  */}
          <Route path="/paciente/" element={<HeaderLayout />}>
            <Route path="" element={<HomePaciente />} />
            <Route path="triagem" element={<TriagemInteligente />} />
            <Route path="fila-atual" element={<FilaAtual />} />
          </Route>
        </Route>
>>>>>>> Stashed changes
      </Routes>
    </BrowserRouter>
  );
}

export default App;
