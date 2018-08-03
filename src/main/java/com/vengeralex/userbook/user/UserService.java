package com.vengeralex.userbook.user;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public Long getCount() { return userRepository.count(); }

    public Page<UserEntity> getAllByPage(Integer page, Integer rows) {
        return userRepository.findAllByPage(new PageRequest(page, rows));
    }

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
