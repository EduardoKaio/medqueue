package com.queueflow.vetqueue.models;

import com.queueflow.queueflow.models.User;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@DiscriminatorValue("DONO")
public class Dono extends User {

    @OneToMany(mappedBy = "dono", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Animal> animais;
}