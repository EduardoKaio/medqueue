package com.queueflow.queueflow.service.admin;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.queueflow.queueflow.dto.FilaDTO;
import com.queueflow.queueflow.models.Fila;
import com.queueflow.queueflow.repository.FilaRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FilaService {

    private final FilaRepository filaRepository;

    public List<Fila> listarTodas() {
        try {
            return filaRepository.findAllByOrderByAtivoDescDataCriacaoDesc();
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
        if (id == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }

        Fila fila = filaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + id));
        
        filaRepository.delete(fila);
    }

    @Transactional
    public Fila editarFila(Long id, FilaDTO dto) {
        if (id == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }
        if (dto == null) {
            throw new IllegalArgumentException("Dados para atualização não podem ser nulos");
        }

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

        if (dto.getTempoMedio() != null) {
            if (dto.getTempoMedio() < 0) {
                throw new IllegalArgumentException("Tempo médio não pode ser negativo");
            }
            fila.setTempoMedio(dto.getTempoMedio());
        }

        if (dto.getAtivo() != null) {
            fila.setAtivo(dto.getAtivo());
        }

        if (dto.getEspecialidade() != null) {
            fila.setEspecialidade(dto.getEspecialidade().toLowerCase());
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
        novaFila.setEspecialidade(novaFila.getEspecialidade().toLowerCase());

        boolean filaExistente = filaRepository.findByEspecialidadeAndAtivoTrue(novaFila.getEspecialidade()).isPresent();

        if (filaExistente) {
            throw new IllegalArgumentException("Não podem existir duas filas com a mesma especialidade");
        }

        return filaRepository.save(novaFila);
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

    public Fila criarFilaGeralDoDia() {
        desativarFilaDoDiaAnterior();

        Fila filaGeralDoDia = new Fila();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
        String dataFormatada = LocalDate.now().format(formatter);

        filaGeralDoDia.setNome("Fila geral do dia");
        filaGeralDoDia.setDescricao("Fila criada automaticamente para o dia " + dataFormatada);
        filaGeralDoDia.setAtivo(true);
        filaGeralDoDia.setDataCriacao(LocalDate.now());
        filaGeralDoDia.setEspecialidade("geral");
        filaGeralDoDia.setTempoMedio(20.0);

        boolean filaExistente = filaRepository.findByEspecialidadeAndAtivoTrue("geral").isPresent();

        if (filaExistente) {
            throw new IllegalArgumentException("Não podem existir duas filas com a mesma especialidade");
        }

        return filaRepository.save(filaGeralDoDia);
    }

    private void desativarFilaDoDiaAnterior() {
        LocalDate ontem = LocalDate.now().minusDays(1);

        Fila filaDeOntem = filaRepository.findByDataCriacaoAndEspecialidade(ontem, "geral")
                                    .orElse(null);

        if (filaDeOntem != null) {
            filaDeOntem.setAtivo(false);

            filaRepository.save(filaDeOntem);
        }
    }
}
