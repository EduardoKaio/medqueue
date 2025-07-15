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
import Perfil from "./pages/paciente/Perfil";
import AnimalList from "./pages/paciente/AnimalList";
import AnimalCreate from "./pages/paciente/AnimalCreate";
import AnimalEdit from "./pages/paciente/AnimalEdit";
import PrivateRoute from "./components/PrivateRoute";
import HeaderLayout from "./components/HeaderLayout";
import FilaAtual from "./pages/paciente/FilaAtual";
import HistoricoFilas from "./pages/paciente/HistoricoFilas";
import HistoricoPacienteAdmin from "./pages/admin/historicoPacienteAdmin";
import AnimaisList from "./pages/admin/AnimaisList";

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
            <Route path="pacientes/historico/:id" element={<HistoricoPacienteAdmin />} />
            <Route path="filas" element={<FilaList />} />
            <Route path="filas/create" element={<FilaCreate />} />
            <Route path="filas/edit/:id" element={<FilaEdit />} />{" "}
            <Route path="filas/:id" element={<FilaPacientesList />} />
            <Route path="perfil" element={<Perfil />} />
            <Route path="animais" element={<AnimaisList />} />
          </Route>

          {/* Pacient Routes  */}

          <Route path="/paciente/" element={<HeaderLayout />}>
            <Route path="" element={<HomePaciente />} />
            <Route path="animais" element={<AnimalList />} />
            <Route path="animais/create" element={<AnimalCreate />} />
            <Route path="animais/edit/:id" element={<AnimalEdit />} />
            <Route path="triagem" element={<TriagemInteligente />} />
            <Route path="fila-atual" element={<FilaAtual />} />
            <Route path="Historico" element={<HistoricoFilas />} />
            <Route path="perfil" element={<Perfil />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
