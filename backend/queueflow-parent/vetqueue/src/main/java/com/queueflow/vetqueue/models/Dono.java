package com.queueflow.vetqueue.models;

import com.queueflow.queueflow.models.User;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("DONO")
public class Dono extends User {

    @OneToMany(mappedBy = "dono", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<Animal> animais;
}