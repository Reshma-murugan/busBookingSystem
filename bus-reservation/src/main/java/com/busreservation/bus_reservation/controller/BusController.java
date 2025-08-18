package com.busreservation.bus_reservation.controller;

import com.busreservation.bus_reservation.dto.BusDtos;
import com.busreservation.bus_reservation.service.BusService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/buses")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @GetMapping("/search")
    public ResponseEntity<BusDtos.BusSearchResponse> search(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(busService.search(from, to, date));
    }

    @GetMapping("/{busId}/seats")
    public ResponseEntity<BusDtos.SeatAvailabilityResponse> seats(
            @PathVariable Long busId,
            @RequestParam("fromStop") Long fromStopId,
            @RequestParam("toStop") Long toStopId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(busService.seatAvailability(busId, fromStopId, toStopId, date));
    }
}
