package com.finki.mojtest.repository.users;

import com.finki.mojtest.model.users.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    @Query(value = "SELECT * FROM app_user WHERE email = :email", nativeQuery = true)
    List<User> findByEmailList(String email);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);

    @Query(value = "SELECT * FROM app_user WHERE role = :role", nativeQuery = true)
    List<User> findByRole(@Param("role") String role);


}
