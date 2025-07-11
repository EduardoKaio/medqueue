package com.queueflow.bankqueue.models;

import com.queueflow.queueflow.models.User;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("CLIENTE")
@NoArgsConstructor
@AllArgsConstructor
public class Cliente extends User {
    
    @Column(name = "numero_conta", nullable = false, unique = true)
    private String numeroConta;

    @Column(name = "agencia", nullable = false)
    private String agencia;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_conta", nullable = false)
    private TipoConta tipoConta;


    public enum TipoConta {
        CORRENTE,
        POUPANCA,
        SALARIO,
        INVESTIMENTO
    }
}