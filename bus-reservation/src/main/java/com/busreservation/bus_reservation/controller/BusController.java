package com.busreservation.bus_reservation.controller;

import com.busreservation.bus_reservation.dto.BusDtos;
import com.busreservation.bus_reservation.service.BusService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/buses")
public class BusController {

    private final BusService busService;

    public BusController(BusService busService) {
        this.busService = busService;
    }

    @GetMapping("/search")
    public ResponseEntity<BusDtos.BusSearchResponse> searchBuses(
            @RequestParam Long fromCityId,
            @RequestParam Long toCityId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "1") Integer seats
    ) {
        return ResponseEntity.ok(busService.searchBuses(fromCityId, toCityId, date, seats));
    }

    @GetMapping("/{busId}")
    public ResponseEntity<BusDtos.BusDetailsResponse> getBusDetails(@PathVariable Long busId) {
        return ResponseEntity.ok(busService.getBusDetails(busId));
    }

    @GetMapping("/{busId}/seats")
    public ResponseEntity<BusDtos.SeatAvailabilityResponse> getSeatAvailability(
            @PathVariable Long busId,
            @RequestParam Long fromStopId,
            @RequestParam Long toStopId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return ResponseEntity.ok(busService.getSeatAvailability(busId, fromStopId, toStopId, date));
    }
}