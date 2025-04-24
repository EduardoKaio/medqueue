package com.medqueue.medqueue.dto;

import java.time.LocalDate;

import groovy.transform.builder.Builder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FilaDTO {
    private Long id;
    private LocalDate data_criaca;
}
