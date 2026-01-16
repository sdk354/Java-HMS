package com.nsbm_projects.hotel_management_system.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Room")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @Column(name = "roomNumber")
    private Integer roomNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "roomTypeID", nullable = false)
    private RoomType roomType;

    @Convert(converter = RoomStatusConverter.class)
    @Column(name = "status", nullable = false, length = 50)
    private RoomStatus status = RoomStatus.AVAILABLE;

    @Column(name = "floorNumber")
    private Integer floorNumber;

    @Column(name = "mapCoordinates", length = 100)
    private String mapCoordinates;

    public boolean isAvailable() {
        return RoomStatus.AVAILABLE.equals(this.status);
    }
}