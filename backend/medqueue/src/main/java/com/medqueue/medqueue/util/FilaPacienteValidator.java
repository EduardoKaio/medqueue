package com.medqueue.medqueue.util;

import com.medqueue.medqueue.models.Fila;
import com.medqueue.medqueue.models.Paciente;

import jakarta.persistence.EntityNotFoundException;

public class FilaPacienteValidator {

    public static void validarCamposObrigatorios(Long pacienteId, Long filaId, Integer prioridade) {
        if (pacienteId == null) throw new IllegalArgumentException("ID do paciente não pode ser nulo");
        if (filaId == null) throw new IllegalArgumentException("ID da fila não pode ser nulo");
        if (prioridade == null) throw new IllegalArgumentException("Prioridade não pode ser nula");
    }

    public static void verificarFilaAtiva(Fila fila) {
        if (fila == null || !fila.getAtivo()) {
            throw new IllegalStateException("Fila está inativa ou nula");
        }
    }

    public static void verificarPacienteExistente(Paciente paciente, Long id) {
        if (paciente == null) {
            throw new EntityNotFoundException("Paciente não encontrado com ID: " + id);
        }
    }

    public static void verificarFilaExistente(Fila fila, Long id) {
        if (fila == null) {
            throw new EntityNotFoundException("Fila não encontrada com ID: " + id);
        }
    }

    public static void verificarIdExistente(Long id) {
        if (id == null) {
            throw new IllegalStateException("O id não pode ser nulo");
        }
    }
}
