package com.vengeralex.userbook.user;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@Entity
public class UserEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String firstName;
    private String lastName;
    private LocalDate birthDay;

    @Enumerated(EnumType.STRING)
    @Column(length = 6)
    private Gender gender;

    public UserEntity(String firstName, String lastName, LocalDate birthDay, Gender gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.birthDay = birthDay;
        this.gender = gender;
    }
}
