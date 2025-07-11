package com.queueflow.vetqueue.dto;

import lombok.Data;

@Data
public class AnimalDTO {
    private Long id;
    private String nome;
    private String especie;
    private String raca;
    private Integer idade;
    private Long donoId;  // FK para associar ao Dono
}
