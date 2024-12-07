package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.users.Admin;
import com.finki.mojtest.model.users.User;
import com.finki.mojtest.repository.users.AdminRepository;
import com.finki.mojtest.service.AdminService;
import com.finki.mojtest.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final AdminRepository adminRepository;
    private final UserService userService;

    @Override
    public Admin createAdmin(Admin admin) {
        return (Admin) userService.createUser(admin);
    }

    @Override
    public Admin getAdminById(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Admin not found with id " + id));
    }

    @Override
    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    @Override
    public Admin updateAdmin(Long id, Admin updatedAdmin) {
        User updatedUser = (User) updatedAdmin;
        updatedUser = userService.updateUser(id, updatedUser);

        // After updating common fields, update admin-specific fields (if any)
        Admin admin = getAdminById(id);

        // No specific fields for Admin entity here, but you can add any if needed
        // We don't have any right now however we will have them in future

        return adminRepository.save(admin); // Save the updated admin
    }


    @Override
    public void deleteAdmin(Long id) {
        getAdminById(id); // Validate existence
        adminRepository.deleteById(id);
    }
}

