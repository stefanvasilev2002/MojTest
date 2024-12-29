package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.users.Admin;
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
        userService.updateUser(id, updatedAdmin);

        Admin admin = getAdminById(id);

        return adminRepository.save(admin);
    }


    @Override
    public void deleteAdmin(Long id) {
        getAdminById(id);
        adminRepository.deleteById(id);
    }
}

