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

    // Getters e setters manuais para garantir funcionamento
    public String getNumeroConta() {
        return numeroConta;
    }

    public void setNumeroConta(String numeroConta) {
        this.numeroConta = numeroConta;
    }

    public String getAgencia() {
        return agencia;
    }

    public void setAgencia(String agencia) {
        this.agencia = agencia;
    }

    public TipoConta getTipoConta() {
        return tipoConta;
    }

    public void setTipoConta(TipoConta tipoConta) {
        this.tipoConta = tipoConta;
    }

    public enum TipoConta {
        CORRENTE,
        POUPANCA,
        SALARIO,
        INVESTIMENTO
    }
}