package com.busreservation.bus_reservation.controller;

import com.busreservation.bus_reservation.dto.CityDto;
import com.busreservation.bus_reservation.service.CityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    private final CityService cityService;

    public CityController(CityService cityService) {
        this.cityService = cityService;
    }

    @GetMapping
    public ResponseEntity<List<CityDto.CityResponse>> getCities(
            @RequestParam(required = false, defaultValue = "") String q
    ) {
        return ResponseEntity.ok(cityService.searchCities(q));
    }
}