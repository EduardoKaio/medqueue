package com.queueflow.vetqueue.repository;

import com.queueflow.vetqueue.models.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    List<Animal> findByDonoId(Long donoId);
}
