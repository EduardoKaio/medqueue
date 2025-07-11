package com.queueflow.vetqueue.controller;

import com.queueflow.vetqueue.dto.AnimalDTO;
import com.queueflow.vetqueue.service.AnimalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/animais")
@RequiredArgsConstructor
public class AnimalController {

    private final AnimalService animalService;
    private final AnimalService donoService;

    @PostMapping
    public ResponseEntity<AnimalDTO> createAnimal(@RequestBody AnimalDTO dto) {
        AnimalDTO created = animalService.createAnimal(dto);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnimalDTO> updateAnimal(@PathVariable Long id, @RequestBody AnimalDTO dto) {
        AnimalDTO updated = animalService.updateAnimal(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnimal(@PathVariable Long id) {
        animalService.deleteAnimal(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalDTO> getAnimal(@PathVariable Long id) {
        AnimalDTO dto = animalService.getAnimalById(id);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/by-dono/{donoId}")
    public ResponseEntity<List<AnimalDTO>> getAnimalsByDono(@PathVariable Long donoId) {
        List<AnimalDTO> dtos = animalService.getAnimalsByDono(donoId);
        return ResponseEntity.ok(dtos);
    }
    @GetMapping("/dono/{cpf}")
    public ResponseEntity<Long> getDonoIdByCpf(@PathVariable String cpf) {
        Long donoId = donoService.getDonoIdByCpf(cpf);
        return ResponseEntity.ok(donoId);
    }

}
