package com.medqueue.medqueue.service.admin;

import com.medqueue.medqueue.models.Fila;
import com.medqueue.medqueue.repository.FilaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FilaService {

    private final FilaRepository filaRepository;

    public List<Fila> listarTodas() {
        return filaRepository.findAll();
    }

    public List<Fila> listarAtivas() {
        return filaRepository.findByAtivoTrue();
    }

    public void deletarFila(Long id) {
        Fila fila = filaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + id));
        filaRepository.delete(fila);
    }

    public Fila atualizarCampo(Long id, String campo, Object valor) {
        Fila fila = filaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + id));

        switch (campo.toLowerCase()) {
            case "nome":
                fila.setNome((String) valor);
                break;
            case "descricao":
                fila.setDescricao((String) valor);
                break;
            case "prioridade":
                fila.setPrioridade((Integer) valor);
                break;
            case "tempo_medio":
                fila.setTempoMedio((Double) valor);
                break;
            default:
                throw new IllegalArgumentException("Campo inválido para atualização: " + campo);
        }

        return filaRepository.save(fila);
    }

    public Long getFilaDoDia() {
        LocalDate hoje = LocalDate.now();

        Fila fila = filaRepository.findByDataCriacao(hoje)
            .orElseThrow(() -> new EntityNotFoundException("Não existe fila criada hoje"));

        return fila.getId();
    }
}
