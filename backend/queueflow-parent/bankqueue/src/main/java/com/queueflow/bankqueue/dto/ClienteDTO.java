package com.queueflow.bankqueue.dto;

import lombok.Data;

import java.time.LocalDate;
import com.queueflow.queueflow.dto.UserDTO;

@Data
public class ClienteDTO extends UserDTO {
   private String numeroConta;
   private String agencia;
   private String tipoConta;
}
