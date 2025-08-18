package com.busreservation.bus_reservation.service;

import com.busreservation.bus_reservation.dto.BusDtos;
import com.busreservation.bus_reservation.exception.NotFoundException;
import com.busreservation.bus_reservation.model.*;
import com.busreservation.bus_reservation.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BusService {

    private final BusRepository busRepository;
    private final StopRepository stopRepository;
    private final CityRepository cityRepository;
    private final TripRepository tripRepository;
    private final PassengerRepository passengerRepository;

    public BusService(BusRepository busRepository, StopRepository stopRepository, 
                     CityRepository cityRepository, TripRepository tripRepository,
                     PassengerRepository passengerRepository) {
        this.busRepository = busRepository;
        this.stopRepository = stopRepository;
        this.cityRepository = cityRepository;
        this.tripRepository = tripRepository;
        this.passengerRepository = passengerRepository;
    }

    public BusDtos.BusSearchResponse searchBuses(Long fromCityId, Long toCityId, LocalDate date, Integer seats) {
        City fromCity = cityRepository.findById(fromCityId)
                .orElseThrow(() -> new NotFoundException("From city not found"));
        City toCity = cityRepository.findById(toCityId)
                .orElseThrow(() -> new NotFoundException("To city not found"));

        List<Bus> allBuses = busRepository.findAll();
        List<BusDtos.BusSearchResult> results = new ArrayList<>();

        for (Bus bus : allBuses) {
            List<Stop> stops = stopRepository.findByBusIdOrderBySequenceAsc(bus.getId());
            
            Stop fromStop = stops.stream()
                    .filter(s -> s.getName().equalsIgnoreCase(fromCity.getName()))
                    .findFirst().orElse(null);
            Stop toStop = stops.stream()
                    .filter(s -> s.getName().equalsIgnoreCase(toCity.getName()))
                    .findFirst().orElse(null);

            if (fromStop != null && toStop != null && fromStop.getSequence() < toStop.getSequence()) {
                // Get trip for this bus on the specified date
                List<Trip> trips = tripRepository.findByBusIdAndTripDate(bus.getId(), date);
                if (!trips.isEmpty()) {
                    Trip trip = trips.get(0);
                    
                    // Calculate available seats for this segment
                    int availableSeats = calculateAvailableSeats(bus.getId(), date, fromStop.getId(), toStop.getId(), bus.getTotalSeats());
                    
                    if (availableSeats >= seats) {
                        String route = fromCity.getName() + " → " + toCity.getName();
                        String duration = calculateDuration(trip.getDepartureTime(), trip.getArrivalTime());
                        
                        results.add(BusDtos.BusSearchResult.builder()
                                .id(bus.getId())
                                .name(bus.getName())
                                .type(bus.getType())
                                .route(route)
                                .departureTime(trip.getDepartureTime())
                                .arrivalTime(trip.getArrivalTime())
                                .duration(duration)
                                .availableSeats(availableSeats)
                                .price(trip.getPrice())
                                .build());
                    }
                }
            }
        }

        return BusDtos.BusSearchResponse.builder()
                .fromCity(fromCity.getName())
                .toCity(toCity.getName())
                .date(date)
                .buses(results)
                .build();
    }

    public BusDtos.BusDetailsResponse getBusDetails(Long busId) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new NotFoundException("Bus not found"));

        List<Stop> stops = stopRepository.findByBusIdOrderBySequenceAsc(busId);
        List<Trip> trips = tripRepository.findByBusIdAndTripDate(busId, LocalDate.now());
        
        Trip trip = trips.isEmpty() ? null : trips.get(0);
        
        List<BusDtos.StopInfo> stopInfos = stops.stream()
                .map(stop -> BusDtos.StopInfo.builder()
                        .id(stop.getId())
                        .name(stop.getName())
                        .sequence(stop.getSequence())
                        .arrivalTime(trip != null ? trip.getDepartureTime().toString() : "N/A")
                        .build())
                .collect(Collectors.toList());

        String route = stops.isEmpty() ? "" : 
                stops.get(0).getName() + " → " + stops.get(stops.size() - 1).getName();
        
        String duration = trip != null ? calculateDuration(trip.getDepartureTime(), trip.getArrivalTime()) : "N/A";

        return BusDtos.BusDetailsResponse.builder()
                .id(bus.getId())
                .name(bus.getName())
                .type(bus.getType())
                .route(route)
                .departureTime(trip != null ? trip.getDepartureTime() : null)
                .arrivalTime(trip != null ? trip.getArrivalTime() : null)
                .duration(duration)
                .totalSeats(bus.getTotalSeats())
                .price(trip != null ? trip.getPrice() : 500)
                .amenities(Arrays.asList("Air Conditioning", "WiFi", "Charging Points", "Entertainment"))
                .stops(stopInfos)
                .build();
    }

    public BusDtos.SeatAvailabilityResponse getSeatAvailability(Long busId, Long fromStopId, Long toStopId, LocalDate date) {
        Bus bus = busRepository.findById(busId)
                .orElseThrow(() -> new NotFoundException("Bus not found"));

        List<BusDtos.SeatInfo> seats = new ArrayList<>();
        Set<Integer> bookedSeats = getBookedSeatsForSegment(busId, date, fromStopId, toStopId);

        for (int seatNo = 1; seatNo <= bus.getTotalSeats(); seatNo++) {
            seats.add(BusDtos.SeatInfo.builder()
                    .seatNo(seatNo)
                    .booked(bookedSeats.contains(seatNo))
                    .build());
        }

        return BusDtos.SeatAvailabilityResponse.builder()
                .busId(busId)
                .date(date)
                .fromStopId(fromStopId)
                .toStopId(toStopId)
                .seats(seats)
                .build();
    }

    private int calculateAvailableSeats(Long busId, LocalDate date, Long fromStopId, Long toStopId, int totalSeats) {
        Set<Integer> bookedSeats = getBookedSeatsForSegment(busId, date, fromStopId, toStopId);
        return totalSeats - bookedSeats.size();
    }

    private Set<Integer> getBookedSeatsForSegment(Long busId, LocalDate date, Long fromStopId, Long toStopId) {
        // Get all bookings for this bus on this date
        List<Booking> bookings = busRepository.findById(busId)
                .map(bus -> bus.getStops().stream()
                        .flatMap(stop -> stop.getBus().getStops().stream())
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList())
                .stream()
                .findFirst()
                .map(stop -> stop.getBus())
                .map(bus -> bookingRepository.findByBusIdAndTripDate(bus.getId(), date))
                .orElse(Collections.emptyList());

        Set<Integer> bookedSeats = new HashSet<>();
        
        // Get stop sequences for overlap calculation
        Map<Long, Integer> stopSequences = stopRepository.findByBusIdOrderBySequenceAsc(busId)
                .stream()
                .collect(Collectors.toMap(Stop::getId, Stop::getSequence));

        Integer requestFromSeq = stopSequences.get(fromStopId);
        Integer requestToSeq = stopSequences.get(toStopId);

        if (requestFromSeq == null || requestToSeq == null) {
            return bookedSeats;
        }

        for (Booking booking : bookings) {
            Integer bookingFromSeq = stopSequences.get(booking.getFromStop().getId());
            Integer bookingToSeq = stopSequences.get(booking.getToStop().getId());

            if (bookingFromSeq != null && bookingToSeq != null) {
                // Check if segments overlap
                if (requestFromSeq < bookingToSeq && bookingFromSeq < requestToSeq) {
                    // Add all passenger seats from this booking
                    booking.getPassengers().forEach(passenger -> 
                            bookedSeats.add(passenger.getSeatNo()));
                }
            }
        }

        return bookedSeats;
    }

    private String calculateDuration(java.time.LocalTime departure, java.time.LocalTime arrival) {
        if (departure == null || arrival == null) return "N/A";
        
        long minutes = java.time.Duration.between(departure, arrival).toMinutes();
        if (minutes < 0) minutes += 24 * 60; // Handle next day arrival
        
        long hours = minutes / 60;
        long mins = minutes % 60;
        
        return String.format("%dh %dm", hours, mins);
    }

    // Add this field to the class
    private final BookingRepository bookingRepository;

    // Update constructor
    public BusService(BusRepository busRepository, StopRepository stopRepository, 
                     CityRepository cityRepository, TripRepository tripRepository,
                     PassengerRepository passengerRepository, BookingRepository bookingRepository) {
        this.busRepository = busRepository;
        this.stopRepository = stopRepository;
        this.cityRepository = cityRepository;
        this.tripRepository = tripRepository;
        this.passengerRepository = passengerRepository;
        this.bookingRepository = bookingRepository;
    }
}