package com.busreservation.bus_reservation.service;

import com.busreservation.bus_reservation.dto.CityDto;
import com.busreservation.bus_reservation.model.City;
import com.busreservation.bus_reservation.repository.CityRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CityService {

    private final CityRepository cityRepository;

    public CityService(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    public List<CityDto.CityResponse> searchCities(String query) {
        List<City> cities;
        if (query == null || query.trim().isEmpty()) {
            cities = cityRepository.findAll();
        } else {
            cities = cityRepository.findByNameStartingWithIgnoreCase(query.trim());
        }

        return cities.stream()
                .map(city -> CityDto.CityResponse.builder()
                        .id(city.getId())
                        .name(city.getName())
                        .state(city.getState())
                        .build())
                .collect(Collectors.toList());
    }
}