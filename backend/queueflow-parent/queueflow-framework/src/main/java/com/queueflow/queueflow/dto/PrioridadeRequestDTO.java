package com.queueflow.queueflow.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PrioridadeRequestDTO {
    private String sintomas;           // usado em apps como MedQueue
    private Integer idade;             // usado em apps como BankQueue
    private Boolean gestante;          // usado em apps como VetQueue ou Banco
    private Boolean deficiente;
    private Boolean idoso;
    private String[] respostasFormulario; // perguntas personalizadas
}
