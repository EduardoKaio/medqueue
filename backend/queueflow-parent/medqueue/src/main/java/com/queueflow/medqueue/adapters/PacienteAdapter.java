package com.queueflow.medqueue.adapters;

import lombok.*;
import com.queueflow.queueflow.models.QueueSubject;
import com.queueflow.medqueue.models.Paciente;

@RequiredArgsConstructor
public class PacienteAdapter implements QueueSubject {
    private final Paciente paciente;

    @Override
    public Long getId() {
        return paciente.getId();
    }

    @Override
    public String getNome() {
        return paciente.getNome();
    }

    @Override
    public String getTelefone() {
        return paciente.getTelefone();
    }

    public Paciente getPaciente() {
        return this.paciente;
    }
}