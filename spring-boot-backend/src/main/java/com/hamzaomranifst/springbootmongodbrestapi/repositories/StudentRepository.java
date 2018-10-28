package com.hamzaomranifst.springbootmongodbrestapi.repositories;

import com.hamzaomranifst.springbootmongodbrestapi.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {
    
}
