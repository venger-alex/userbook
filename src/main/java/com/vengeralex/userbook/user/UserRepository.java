package com.vengeralex.userbook.user;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findById(Integer id);

    @Query("SELECT user FROM UserEntity AS user ORDER BY user.id ASC ")
    Page<UserEntity> findAllByPage(Pageable pageable);
}
