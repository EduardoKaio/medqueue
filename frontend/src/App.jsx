import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PacienteList from "./pages/Admin/PacienteList";
import PacienteCreate from "./pages/Admin/PacienteCreate";
import PacienteEdit from "./pages/Admin/PacienteEdit";
import Home from "./pages/Home";
import Dashboard from "./pages/Admin/Dashboard";
import FilaList from "./pages/Admin/Filalist";
import FilaCreate from "./pages/Admin/FilaCreate";
import FilaPacientesList from "./pages/Admin/FilaPacienteList";
import Register from "./pages/auth/Register";
import LoginPage from "./pages/auth/Login";
import TriagemInteligente from "./pages/Paciente/TriagemInteligente";
import HomePaciente from "./pages/Paciente/HomePaciente";

import PrivateRoute from "./components/PrivateRoute";
import HeaderLayout from "./components/HeaderLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Authentication Routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          {/* Admin Routes  */}
          <Route path="/admin/" element={<HeaderLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pacientes" element={<PacienteList />} />
            <Route path="pacientes/create" element={<PacienteCreate />} />
            <Route path="pacientes/edit/:id" element={<PacienteEdit />} />
            <Route path="filas" element={<FilaList />} />
            <Route path="filas/create" element={<FilaCreate />} />
            <Route path="filas/:id" element={<FilaPacientesList />} />
          </Route>

          {/* Pacient Routes  */}
          <Route path="/paciente" element={<HeaderLayout />}>
            <Route path="" element={<HomePaciente />} />
            <Route path="triagem" element={<TriagemInteligente />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
