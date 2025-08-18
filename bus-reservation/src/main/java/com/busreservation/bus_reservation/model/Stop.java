package com.busreservation.bus_reservation.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "stops")
public class Stop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer sequence; // order of stop in the route

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bus_id", nullable = false)
    private Bus bus;
}
