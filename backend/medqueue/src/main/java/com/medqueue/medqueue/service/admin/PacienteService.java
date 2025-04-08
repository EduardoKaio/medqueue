package com.medqueue.medqueue.service.admin;

import com.medqueue.medqueue.dto.admin.PacienteDTO;
import com.medqueue.medqueue.models.Paciente;
import com.medqueue.medqueue.repository.PacienteRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PacienteService {

    private final PacienteRepository pacienteRepository;
    private final ModelMapper modelMapper;

    public List<PacienteDTO> listarTodos() {
        return pacienteRepository.findAll()
                .stream()
                .map(paciente -> modelMapper.map(paciente, PacienteDTO.class))
                .collect(Collectors.toList());
    }

    public PacienteDTO buscarPorId(Long id) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com ID: " + id));
        return modelMapper.map(paciente, PacienteDTO.class);
    }

    public PacienteDTO criar(PacienteDTO pacienteDTO) {
        if (pacienteRepository.existsByCpf(pacienteDTO.getCpf())) {
            throw new IllegalArgumentException("Já existe um paciente com esse CPF.");
        }

        Paciente paciente = modelMapper.map(pacienteDTO, Paciente.class);
        Paciente salvo = pacienteRepository.save(paciente);

        return modelMapper.map(salvo, PacienteDTO.class);
    }

    public PacienteDTO atualizar(Long id, PacienteDTO pacienteDTO) {
        Paciente existente = pacienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com ID: " + id));

        modelMapper.map(pacienteDTO, existente); // copia os dados do DTO para o existente
        Paciente atualizado = pacienteRepository.save(existente);

        return modelMapper.map(atualizado, PacienteDTO.class);
    }

    public void deletar(Long id) {
        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Paciente não encontrado com ID: " + id));
        pacienteRepository.delete(paciente);
    }

    public long getContagem() {
        return pacienteRepository.count();
    }
}
