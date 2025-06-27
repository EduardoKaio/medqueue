package com.queueflow.queueflow.service.user;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.queueflow.queueflow.dto.HistoricoFilaDTO;
import com.queueflow.queueflow.dto.InfoFilaParaUserDTO;
import com.queueflow.queueflow.models.FilaUser;
import com.queueflow.queueflow.repository.FilaUserRepository;
import com.queueflow.queueflow.service.auth.AuthService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InfoFilaUserService {

    private final FilaUserRepository filaUserRepository;
    private final AuthService authService;

    public InfoFilaParaUserDTO infoFilaUser() {
        Long userId = authService.getIdDoUsuario();

        return filaUserRepository
                .findFirstByUserIdAndStatusAndFilaAtivoTrue(userId, "Na fila")
                .filter(filaUser -> {
                    return !("Atendido".equals(filaUser.getStatus()) || Boolean.TRUE.equals(filaUser.getCheckIn()));
                })
                .map(filaUser -> {
                    int posicao = filaUser.getPosicao();
                    double tempoMedio = filaUser.getFila().getTempoMedio();
                    double tempoEstimado = tempoMedio * (posicao - 1);

                    return new InfoFilaParaUserDTO(
                            filaUser.getFila().getId(),
                            userId,
                            posicao,
                            tempoEstimado
                    );
                })
                .orElse(null); // retorna null se não estiver em nenhuma fila válida
    }


    public List<HistoricoFilaDTO> historicoFilasUser() {
        Long userId = authService.getIdDoUsuario();

        List<FilaUser> filas = filaUserRepository.findAllByUserId(userId);

        if (filas.isEmpty()) {
            throw new RuntimeException("O user ainda não possui histórico de filas.");
        }

        return filas.stream()
            .filter(filaUser -> filaUser.getFila() != null)
            .map(filaUser -> new HistoricoFilaDTO(
                filaUser.getFila().getId(),
                filaUser.getFila().getNome(),
                filaUser.getFila().getEspecialidade(),
                filaUser.getPrioridade(),
                filaUser.getStatus(),
                filaUser.getDataEntrada()
            ))
            .collect(Collectors.toList());
    }
    
}

