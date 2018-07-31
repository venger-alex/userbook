package com.vengeralex.userbook.user;

import com.vengeralex.userbook.util.ErrorBody;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/all")
    public List<UserEntity> getAll() {
        return userService.getAll();
    }

    @GetMapping("/users")
    public List<UserEntity> getUsers() {
        return userService.getAll();
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        Optional<UserEntity> mayBeUserEntity = userService.getById(id);

        return mayBeUserEntity.map(Object.class::cast)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.badRequest()
                        .body(new ErrorBody("There is no user with ID = " + id)));
    }

    @PostMapping("/users")
    public ResponseEntity<Void> create(@RequestBody UserEntity user) {
        UserEntity saved = userService.save(user);
        return ResponseEntity.created(URI.create("/users/" + saved.getId())).build();
    }

    @PutMapping("/users/{id}")
    public synchronized void update(@PathVariable Integer id, @RequestBody UserEntity user) {
        user.setId(id);
        userService.save(user);
    }

    @DeleteMapping("/users/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Integer id) {
        userService.delete(id)
                .orElseThrow(NoSuchUserException::new);
    }

}
