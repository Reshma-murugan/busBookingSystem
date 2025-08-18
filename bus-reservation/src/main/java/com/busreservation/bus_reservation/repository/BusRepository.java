package com.busreservation.bus_reservation.repository;

import com.busreservation.bus_reservation.model.Bus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRepository extends JpaRepository<Bus, Long> {
}
