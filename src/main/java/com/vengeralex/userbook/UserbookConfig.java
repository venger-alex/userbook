package com.vengeralex.userbook;

import com.vengeralex.userbook.user.Gender;
import com.vengeralex.userbook.user.UserEntity;
import com.vengeralex.userbook.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class UserbookConfig {
    @Bean
    CommandLineRunner initDb(UserRepository userRepository) {
        return args -> {
            if (!userRepository.findAll().isEmpty()) {
                return;
            }

            userRepository.save(new UserEntity("Alex", "Venger", LocalDate.now(), Gender.MALE));
            userRepository.save(new UserEntity("Yulia", "Venger", LocalDate.now(), Gender.FEMALE));
            userRepository.save(new UserEntity("Andrey", "Venger", LocalDate.now(), Gender.MALE));
            userRepository.save(new UserEntity("Helen", "Venger", LocalDate.now(), Gender.FEMALE));
            userRepository.save(new UserEntity("Max", "Venger", LocalDate.now(), Gender.MALE));
            userRepository.save(new UserEntity("Petr", "Petrov", LocalDate.now(), Gender.MALE));
            userRepository.save(new UserEntity("Ivan", "Ivanov", LocalDate.now(), Gender.MALE));
            userRepository.save(new UserEntity("Sonya", "Sidorova", LocalDate.now(), Gender.FEMALE));
            userRepository.save(new UserEntity("John", "Smith", LocalDate.now(), Gender.MALE));
            userRepository.save(new UserEntity("Tim", "Goodman", LocalDate.now(), Gender.MALE));
            userRepository.save(new UserEntity("Tanya", "Postman", LocalDate.now(), Gender.FEMALE));
            userRepository.save(new UserEntity("Katya", "Trueman", LocalDate.now(), Gender.FEMALE));
            userRepository.save(new UserEntity("Dan", "Brown", LocalDate.now(), Gender.MALE));
            userRepository.save(new UserEntity("Kolya", "Monatik", LocalDate.now(), Gender.MALE));
            userRepository.save(new UserEntity("Vika", "Noname", LocalDate.now(), Gender.FEMALE));
        };
    }
}
