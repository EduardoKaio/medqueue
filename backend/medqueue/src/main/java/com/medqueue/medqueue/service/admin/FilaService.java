package com.medqueue.medqueue.service.admin;

import com.medqueue.medqueue.models.Fila;
import com.medqueue.medqueue.repository.FilaRepository;
import com.medqueue.medqueue.dto.FilaDTO;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FilaService {

    private final FilaRepository filaRepository;

    public List<Fila> listarTodas() {
        try {
            return filaRepository.findAll();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar filas: " + e.getMessage(), e);
        }
    }

    public List<Fila> listarAtivas() {
        try {
            return filaRepository.findByAtivoTrue();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao listar filas ativas: " + e.getMessage(), e);
        }
    }

    @Transactional
    public void deletarFila(Long id) {
        if (id == null) throw new IllegalArgumentException("ID da fila não pode ser nulo");

        Fila fila = filaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + id));
        filaRepository.delete(fila);
    }

    @Transactional
    public Fila editarFila(Long id, FilaDTO dto) {
        if (id == null) throw new IllegalArgumentException("ID da fila não pode ser nulo");
        if (dto == null) throw new IllegalArgumentException("Dados para atualização não podem ser nulos");

        Fila fila = filaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + id));

        if (dto.getNome() != null) {
            if (dto.getNome().trim().isEmpty()) {
                throw new IllegalArgumentException("Nome da fila não pode ser vazio");
            }
            fila.setNome(dto.getNome());
        }

        if (dto.getDescricao() != null) {
            fila.setDescricao(dto.getDescricao());
        }

        if (dto.getPrioridade() != null) {
            if (dto.getPrioridade() < 0) {
                throw new IllegalArgumentException("Prioridade não pode ser negativa");
            }
            fila.setPrioridade(dto.getPrioridade());
        }

        if (dto.getTempoMedio() != null) {
            if (dto.getTempoMedio() < 0) {
                throw new IllegalArgumentException("Tempo médio não pode ser negativo");
            }
            fila.setTempoMedio(dto.getTempoMedio());
        }

        if (dto.getAtivo() != null) {
            fila.setAtivo(dto.getAtivo());
        }
        
        if (dto.getTempoMedio() != null) {
              if (dto.getTempoMedio() < 0) {
                  throw new IllegalArgumentException("Tempo médio não pode ser negativo");
              }
              fila.setTempoMedio(dto.getTempoMedio());
          }

        if (dto.getAtivo() != null) {
            fila.setAtivo(dto.getAtivo());
        }

        return filaRepository.save(fila);
    }

    @Transactional
    public Fila criarFila(Fila novaFila) {
      if (novaFila.getNome() == null || novaFila.getNome().trim().isEmpty()) {
          throw new IllegalArgumentException("O nome da fila é obrigatório.");
      }
      if (novaFila.getTempoMedio() == null || novaFila.getTempoMedio() < 0) {
          throw new IllegalArgumentException("O tempo médio deve ser um número não negativo.");
      }

      novaFila.setAtivo(true);
      novaFila.setDataCriacao(LocalDate.now());
      return filaRepository.save(novaFila);
    }


    public Long getFilaDoDia() {
        LocalDate hoje = LocalDate.now();

        Fila fila = filaRepository.findByDataCriacao(hoje)
                .orElseThrow(() -> new EntityNotFoundException("Não existe fila criada hoje"));

        return fila.getId();
    }

    public Fila buscarPorId(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }

        return filaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + id));
    }
    public long getContagem() {
        try {
            return filaRepository.countByAtivoTrue();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao contar filas ativas: " + e.getMessage(), e);
        }
    }
}
