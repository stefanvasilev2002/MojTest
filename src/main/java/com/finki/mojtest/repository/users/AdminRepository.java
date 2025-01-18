package com.finki.mojtest.repository.users;

import com.finki.mojtest.model.users.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findFirstByOrderById();

    Optional<Admin> findFirstByIdNot(Long id);
}
