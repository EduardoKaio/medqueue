package com.queueflow.bankqueue.strategy;

import com.queueflow.queueflow.dto.PrioridadeRequestDTO;
import com.queueflow.queueflow.strategy.PrioridadeStrategy;
import org.springframework.stereotype.Component;

@Component
public class BankPrioridadeStrategy implements PrioridadeStrategy {


    private String ultimoEspecialista = "Não identificado";
    private String justificativaPrioridade = "Não fornecida";
    private String justificativaEspecialista = "Não fornecida";

    @Override
    public int calcularPrioridade(PrioridadeRequestDTO dados) {
        Boolean deficiente = dados.getDeficiente();
        String sexo = dados.getSexo(); // "M" ou "F"
        Boolean gestante = dados.getGestante();
        String dataNascimento = dados.getDataNascimento(); 

        // 1. Deficiente
        if (Boolean.TRUE.equals(deficiente)) {
            ultimoEspecialista = "Guichê prioritário";
            justificativaPrioridade = "Cliente com deficiência";
            justificativaEspecialista = "Atendimento prioritário por lei";
            return 1;
        }

        // 2. Idoso (>= 60 anos)
        if (dataNascimento != null && !dataNascimento.isBlank()) {
            try {
                java.time.LocalDate nascimento = java.time.LocalDate.parse(dataNascimento);
                java.time.LocalDate hoje = java.time.LocalDate.now();
                int idade = java.time.Period.between(nascimento, hoje).getYears();
                if (idade >= 60) {
                    ultimoEspecialista = "Guichê prioritário";
                    justificativaPrioridade = "Cliente idoso (>= 60 anos)";
                    justificativaEspecialista = "Atendimento prioritário por lei";
                    return 1;
                }
            } catch (Exception e) {
                
            }
        }

        // 3. Gestante (só se mulher)
        if ("F".equalsIgnoreCase(sexo) && Boolean.TRUE.equals(gestante)) {
            ultimoEspecialista = "Guichê prioritário";
            justificativaPrioridade = "Cliente gestante";
            justificativaEspecialista = "Atendimento prioritário por lei";
            return 1;
        }

        // Se nenhuma condição prioritária
        ultimoEspecialista = "Guichê comum";
        justificativaPrioridade = "Cliente sem prioridade especial";
        justificativaEspecialista = "Atendimento padrão";
        return 3;
    }

    public String getUltimoEspecialista() {
        return ultimoEspecialista;
    }

    public String getJustificativaPrioridade() {
        return justificativaPrioridade;
    }

    public String getJustificativaEspecialista() {
        return justificativaEspecialista;
    }

}
