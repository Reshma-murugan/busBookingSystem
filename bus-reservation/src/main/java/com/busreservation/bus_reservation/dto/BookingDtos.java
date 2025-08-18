package com.busreservation.bus_reservation.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

public class BookingDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingRequest {
        private Long busId;
        private Long fromStopId;
        private Long toStopId;
        private LocalDate date;
        private List<Integer> seatNos;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookingResponse {
        private Long bookingId;
        private Long busId;
        private LocalDate date;
        private List<Integer> seatNos;
    }
}
