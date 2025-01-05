package com.finki.mojtest.service;

import com.finki.mojtest.model.users.Admin;

import java.util.List;

public interface AdminService {
    Admin createAdmin(Admin admin);
    Admin getAdminById(Long id);
    List<Admin> getAllAdmins();
    Admin updateAdmin(Long id, Admin updatedAdmin);
    void deleteAdmin(Long id);
}
