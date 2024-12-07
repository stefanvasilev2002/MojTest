package com.finki.mojtest.repository.users;

import com.finki.mojtest.model.users.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    // Custom queries specific to Admin can be added here if needed
}
