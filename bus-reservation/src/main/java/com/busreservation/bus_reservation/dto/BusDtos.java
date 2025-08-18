package com.busreservation.bus_reservation.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class BusDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BusSearchResponse {
        private String fromCity;
        private String toCity;
        private LocalDate date;
        private List<BusSearchResult> buses;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BusSearchResult {
        private Long id;
        private String name;
        private String type;
        private String route;
        private LocalTime departureTime;
        private LocalTime arrivalTime;
        private String duration;
        private Integer availableSeats;
        private Integer price;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BusDetailsResponse {
        private Long id;
        private String name;
        private String type;
        private String route;
        private LocalTime departureTime;
        private LocalTime arrivalTime;
        private String duration;
        private Integer totalSeats;
        private Integer price;
        private List<String> amenities;
        private List<StopInfo> stops;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StopInfo {
        private Long id;
        private String name;
        private Integer sequence;
        private String arrivalTime;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SeatAvailabilityResponse {
        private Long busId;
        private LocalDate date;
        private Long fromStopId;
        private Long toStopId;
        private List<SeatInfo> seats;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SeatInfo {
        private Integer seatNo;
        private Boolean booked;
    }
}