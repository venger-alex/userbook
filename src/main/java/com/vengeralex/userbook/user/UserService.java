package com.vengeralex.userbook.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public List<UserEntity> getAll() {
        return userRepository.findAll();
    }

    public Optional<UserEntity> getById(Integer id) {
        return userRepository.findById(id);
    }

    public UserEntity save(UserEntity userEntity) {
        return userRepository.save(userEntity);
    }

    public Optional<UserEntity> delete(Integer id) {
        Optional<UserEntity> mayBeUserEntity = userRepository.findById(id);
        mayBeUserEntity.ifPresent(userEntity -> userRepository.delete(userEntity.getId()));
        return mayBeUserEntity;
    }
}
