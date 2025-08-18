package com.busreservation.bus_reservation.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

public class BusDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BusSummary {
        private Long id;
        private String name;
        private String type;
        private Integer totalSeats;
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
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BusSearchResponse {
        private List<BusSummary> buses;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeatAvailabilityRequest {
        private Long busId;
        private Long fromStopId;
        private Long toStopId;
        private LocalDate date;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SeatAvailabilityResponse {
        private Long busId;
        private Long fromStopId;
        private Long toStopId;
        private LocalDate date;
        private List<Integer> availableSeats;
        private List<Integer> bookedSeats;
    }
}
