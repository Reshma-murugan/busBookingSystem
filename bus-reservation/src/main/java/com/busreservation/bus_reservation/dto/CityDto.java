package com.busreservation.bus_reservation.dto;

import lombok.*;

public class CityDto {
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CityResponse {
        private Long id;
        private String name;
        private String state;
    }
}