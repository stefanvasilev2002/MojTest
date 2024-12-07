package com.finki.mojtest.repository.users;

import com.finki.mojtest.model.users.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {

}
