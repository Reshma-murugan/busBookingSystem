package com.busreservation.bus_reservation.controller;

import com.busreservation.bus_reservation.dto.BookingDtos;
import com.busreservation.bus_reservation.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/bookings")
    public ResponseEntity<BookingDtos.BookingResponse> createBooking(
            Authentication authentication,
            @RequestBody BookingDtos.BookingRequest request
    ) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.createBooking(userEmail, request));
    }

    @GetMapping("/user/bookings")
    public ResponseEntity<List<BookingDtos.BookingHistoryResponse>> getUserBookings(
            Authentication authentication
    ) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.getUserBookings(userEmail));
    }
}