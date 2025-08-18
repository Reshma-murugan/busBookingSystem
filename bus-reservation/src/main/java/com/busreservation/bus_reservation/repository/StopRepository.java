package com.busreservation.bus_reservation.repository;

import com.busreservation.bus_reservation.model.Stop;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StopRepository extends JpaRepository<Stop, Long> {
    List<Stop> findByBusIdOrderBySequenceAsc(Long busId);
}
