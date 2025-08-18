package com.busreservation.bus_reservation.service;

import com.busreservation.bus_reservation.dto.BusDtos;
import com.busreservation.bus_reservation.exception.NotFoundException;
import com.busreservation.bus_reservation.model.Booking;
import com.busreservation.bus_reservation.model.Bus;
import com.busreservation.bus_reservation.model.Stop;
import com.busreservation.bus_reservation.repository.BookingRepository;
import com.busreservation.bus_reservation.repository.BusRepository;
import com.busreservation.bus_reservation.repository.StopRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BusService {

    private final BusRepository busRepository;
    private final StopRepository stopRepository;
    private final BookingRepository bookingRepository;

    public BusService(BusRepository busRepository, StopRepository stopRepository, BookingRepository bookingRepository) {
        this.busRepository = busRepository;
        this.stopRepository = stopRepository;
        this.bookingRepository = bookingRepository;
    }

    public BusDtos.BusSearchResponse search(String from, String to, LocalDate date) {
        List<Bus> all = busRepository.findAll();
        List<Bus> matched = new ArrayList<>();
        for (Bus bus : all) {
            List<Stop> stops = stopRepository.findByBusIdOrderBySequenceAsc(bus.getId());
            Optional<Stop> fromStop = stops.stream().filter(s -> s.getName().equalsIgnoreCase(from)).findFirst();
            Optional<Stop> toStop = stops.stream().filter(s -> s.getName().equalsIgnoreCase(to)).findFirst();
            if (fromStop.isPresent() && toStop.isPresent() && fromStop.get().getSequence() < toStop.get().getSequence()) {
                matched.add(bus);
            }
        }
        List<BusDtos.BusSummary> summaries = matched.stream().map(bus -> {
            List<Stop> stops = stopRepository.findByBusIdOrderBySequenceAsc(bus.getId());
            List<BusDtos.StopInfo> stopInfos = stops.stream()
                    .map(s -> BusDtos.StopInfo.builder().id(s.getId()).name(s.getName()).sequence(s.getSequence()).build())
                    .collect(Collectors.toList());
            return BusDtos.BusSummary.builder()
                    .id(bus.getId())
                    .name(bus.getName())
                    .type(bus.getType())
                    .totalSeats(bus.getTotalSeats())
                    .stops(stopInfos)
                    .build();
        }).collect(Collectors.toList());
        return BusDtos.BusSearchResponse.builder().buses(summaries).build();
    }

    public BusDtos.SeatAvailabilityResponse seatAvailability(Long busId, Long fromStopId, Long toStopId, LocalDate date) {
        Bus bus = busRepository.findById(busId).orElseThrow(() -> new NotFoundException("Bus not found"));
        List<Stop> stops = stopRepository.findByBusIdOrderBySequenceAsc(busId);
        Map<Long, Integer> seqByStopId = stops.stream().collect(Collectors.toMap(Stop::getId, Stop::getSequence));
        Integer start = seqByStopId.get(fromStopId);
        Integer end = seqByStopId.get(toStopId);
        if (start == null || end == null || start >= end) {
            throw new IllegalArgumentException("Invalid stop segment");
        }

        List<Booking> bookings = bookingRepository.findByBusIdAndDate(busId, date);
        // Build a map of seatNo -> list of occupied intervals [start,end)
        Map<Integer, List<int[]>> occupied = new HashMap<>();
        for (Booking b : bookings) {
            int bStart = seqByStopId.get(b.getFromStop().getId());
            int bEnd = seqByStopId.get(b.getToStop().getId());
            occupied.computeIfAbsent(b.getSeatNo(), k -> new ArrayList<>()).add(new int[]{bStart, bEnd});
        }

        List<Integer> available = new ArrayList<>();
        List<Integer> booked = new ArrayList<>();
        for (int seat = 1; seat <= bus.getTotalSeats(); seat++) {
            List<int[]> intervals = occupied.getOrDefault(seat, Collections.emptyList());
            boolean overlaps = intervals.stream().anyMatch(iv -> intervalsOverlap(start, end, iv[0], iv[1]));
            if (overlaps) booked.add(seat); else available.add(seat);
        }
        return BusDtos.SeatAvailabilityResponse.builder()
                .busId(busId)
                .fromStopId(fromStopId)
                .toStopId(toStopId)
                .date(date)
                .availableSeats(available)
                .bookedSeats(booked)
                .build();
    }

    private boolean intervalsOverlap(int aStart, int aEnd, int bStart, int bEnd) {
        // [start, end) overlap check
        return aStart < bEnd && bStart < aEnd;
    }
}
