package com.busreservation.bus_reservation.repository;

import com.busreservation.bus_reservation.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByBusIdAndDate(Long busId, LocalDate date);
    List<Booking> findByUserId(Long userId);
}
