package com.finki.mojtest.repository.users;

import com.finki.mojtest.model.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    List<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    List<User> findByRole(String role);
}
