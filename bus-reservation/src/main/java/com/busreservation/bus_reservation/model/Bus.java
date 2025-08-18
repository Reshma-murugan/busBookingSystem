package com.busreservation.bus_reservation.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "buses")
public class Bus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name; // Travel name

    @Column(nullable = false)
    private String type; // AC / Non-AC

    @Column(nullable = false)
    private Integer totalSeats; // e.g., 28

    @OneToMany(mappedBy = "bus", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("sequence ASC")
    @Builder.Default
    private List<Stop> stops = new ArrayList<>();
}
