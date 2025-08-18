package com.busreservation.bus_reservation.controller;

import com.busreservation.bus_reservation.dto.BookingDtos;
import com.busreservation.bus_reservation.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingDtos.BookingResponse> book(Authentication authentication,
                                                            @RequestBody BookingDtos.BookingRequest request) {
        String userEmail = authentication.getName();
        return ResponseEntity.ok(bookingService.book(userEmail, request));
    }
}
