package com.busreservation.bus_reservation.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class BookingDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BookingRequest {
        private Long busId;
        private LocalDate tripDate;
        private Long fromStopId;
        private Long toStopId;
        private List<Integer> seatIds;
        private List<PassengerInfo> passengers;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PassengerInfo {
        private String name;
        private Integer age;
        private String gender;
        private Integer seatNo;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookingResponse {
        private Long bookingId;
        private String pnr;
        private String status;
        private LocalDateTime bookingTime;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BookingHistoryResponse {
        private Long id;
        private String pnr;
        private String busName;
        private LocalDate tripDate;
        private String fromStop;
        private String toStop;
        private String status;
        private LocalDateTime bookingTime;
        private List<Integer> seats;
        private List<PassengerInfo> passengers;
    }
}