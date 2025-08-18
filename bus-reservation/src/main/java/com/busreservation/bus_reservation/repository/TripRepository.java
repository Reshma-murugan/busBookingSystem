package com.busreservation.bus_reservation.repository;

import com.busreservation.bus_reservation.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByTripDate(LocalDate tripDate);
    List<Trip> findByBusIdAndTripDate(Long busId, LocalDate tripDate);
}