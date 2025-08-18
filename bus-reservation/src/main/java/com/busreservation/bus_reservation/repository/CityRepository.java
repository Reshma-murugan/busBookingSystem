package com.busreservation.bus_reservation.repository;

import com.busreservation.bus_reservation.model.City;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CityRepository extends JpaRepository<City, Long> {
    @Query("SELECT c FROM City c WHERE LOWER(c.name) LIKE LOWER(CONCAT(:query, '%'))")
    List<City> findByNameStartingWithIgnoreCase(@Param("query") String query);
}