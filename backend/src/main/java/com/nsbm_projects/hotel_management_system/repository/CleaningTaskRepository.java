package com.nsbm_projects.hotel_management_system.repository;

import com.nsbm_projects.hotel_management_system.model.CleaningTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CleaningTaskRepository extends JpaRepository<CleaningTask, Integer> {

    List<CleaningTask> findByAssignedUser_UserIDAndStatusNot(Integer userID, String status);

    long countByStatus(String status);
}