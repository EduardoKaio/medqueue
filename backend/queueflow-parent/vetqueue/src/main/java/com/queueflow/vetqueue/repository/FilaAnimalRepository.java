// no pacote com.queueflow.vetqueue.repository
package com.queueflow.vetqueue.repository;

import com.queueflow.queueflow.repository.FilaUserRepository;
import com.queueflow.vetqueue.models.FilaAnimal;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FilaAnimalRepository extends FilaUserRepository<FilaAnimal> {
    List<FilaAnimal> findByAnimalIdAndFilaId(Long animalId, Long filaId);

    Optional<FilaAnimal> findByAnimalIdAndFilaIdAndStatus(Long animalId, Long filaId, String status);
}