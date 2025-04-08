package com.medqueue.medqueue.mapper;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.medqueue.medqueue.dto.admin.PacienteDTO;
import com.medqueue.medqueue.models.Paciente;


@Service
public class PacienteMapper {

    @Autowired
    private ModelMapper modelMapper;

    public PacienteDTO toDTO(Paciente paciente) {
        return modelMapper.map(paciente, PacienteDTO.class);
    }

    public Paciente toEntity(PacienteDTO pacienteDTO) {
        return modelMapper.map(pacienteDTO, Paciente.class);
    }
}
