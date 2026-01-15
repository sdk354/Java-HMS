package com.nsbm_projects.hotel_management_system.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Table(name = "CleaningTask")
@Data
public class CleaningTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer taskID;

    @ManyToOne
    @JoinColumn(name = "roomID")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "userID")
    private User assignedUser;

    private LocalDate assignedDate;

    private String status; // Pending, In Progress, Completed

    @Column(columnDefinition = "TEXT")
    private String notes;
}