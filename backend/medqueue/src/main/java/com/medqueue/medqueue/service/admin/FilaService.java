package com.medqueue.medqueue.service.admin;

import com.medqueue.medqueue.models.Fila;
import com.medqueue.medqueue.repository.FilaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        if (id == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }

        try {
            Fila fila = filaRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + id));
            filaRepository.delete(fila);
        } catch (EntityNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao deletar fila: " + e.getMessage(), e);
        }
    }

    @Transactional
    public Fila atualizarCampo(Long id, String campo, Object valor) {
        if (id == null) {
            throw new IllegalArgumentException("ID da fila não pode ser nulo");
        }
        if (campo == null || campo.trim().isEmpty()) {
            throw new IllegalArgumentException("Nome do campo não pode ser nulo ou vazio");
        }
        if (valor == null) {
            throw new IllegalArgumentException("Valor do campo não pode ser nulo");
        }

        try {
            Fila fila = filaRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Fila não encontrada com ID: " + id));

            switch (campo.toLowerCase()) {
                case "nome":
                    if (!(valor instanceof String)) {
                        throw new IllegalArgumentException("Valor para o campo 'nome' deve ser uma String");
                    }
                    String nome = (String) valor;
                    if (nome.trim().isEmpty()) {
                        throw new IllegalArgumentException("Nome da fila não pode ser vazio");
                    }
                    fila.setNome(nome);
                    break;
                case "descricao":
                    if (!(valor instanceof String)) {
                        throw new IllegalArgumentException("Valor para o campo 'descricao' deve ser uma String");
                    }
                    fila.setDescricao((String) valor);
                    break;
                case "prioridade":
                    if (!(valor instanceof Integer)) {
                        throw new IllegalArgumentException("Valor para o campo 'prioridade' deve ser um Integer");
                    }
                    Integer prioridade = (Integer) valor;
                    if (prioridade < 0) {
                        throw new IllegalArgumentException("Prioridade não pode ser negativa");
                    }
                    fila.setPrioridade(prioridade);
                    break;
                case "tempo_medio":
                    if (!(valor instanceof Double)) {
                        throw new IllegalArgumentException("Valor para o campo 'tempo_medio' deve ser um Double");
                    }
                    Double tempoMedio = (Double) valor;
                    if (tempoMedio < 0) {
                        throw new IllegalArgumentException("Tempo médio não pode ser negativo");
                    }
                    fila.setTempoMedio(tempoMedio);
                    break;
                default:
                    throw new IllegalArgumentException("Campo inválido para atualização: " + campo);
            }

            return filaRepository.save(fila);
        } catch (EntityNotFoundException | IllegalArgumentException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Erro ao atualizar fila: " + e.getMessage(), e);
        }
    }
}
