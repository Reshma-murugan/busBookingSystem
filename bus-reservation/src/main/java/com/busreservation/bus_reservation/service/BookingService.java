package com.busreservation.bus_reservation.service;

import com.busreservation.bus_reservation.dto.BookingDtos;
import com.busreservation.bus_reservation.exception.NotFoundException;
import com.busreservation.bus_reservation.model.Booking;
import com.busreservation.bus_reservation.model.Bus;
import com.busreservation.bus_reservation.model.Stop;
import com.busreservation.bus_reservation.model.User;
import com.busreservation.bus_reservation.repository.BookingRepository;
import com.busreservation.bus_reservation.repository.BusRepository;
import com.busreservation.bus_reservation.repository.StopRepository;
import com.busreservation.bus_reservation.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BusRepository busRepository;
    private final StopRepository stopRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          BusRepository busRepository,
                          StopRepository stopRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.busRepository = busRepository;
        this.stopRepository = stopRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingDtos.BookingResponse book(String userEmail, BookingDtos.BookingRequest req) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new NotFoundException("User not found"));
        Bus bus = busRepository.findById(req.getBusId()).orElseThrow(() -> new NotFoundException("Bus not found"));
        List<Stop> stops = stopRepository.findByBusIdOrderBySequenceAsc(bus.getId());
        Map<Long, Integer> seqByStopId = stops.stream().collect(Collectors.toMap(Stop::getId, Stop::getSequence));
        Stop fromStop = stops.stream().filter(s -> s.getId().equals(req.getFromStopId())).findFirst()
                .orElseThrow(() -> new NotFoundException("From stop not found"));
        Stop toStop = stops.stream().filter(s -> s.getId().equals(req.getToStopId())).findFirst()
                .orElseThrow(() -> new NotFoundException("To stop not found"));

        int start = seqByStopId.get(fromStop.getId());
        int end = seqByStopId.get(toStop.getId());
        if (start >= end) throw new IllegalArgumentException("Invalid stop segment");

        LocalDate date = req.getDate();
        List<Booking> existing = bookingRepository.findByBusIdAndDate(bus.getId(), date);
        Map<Integer, List<int[]>> occupied = new HashMap<>();
        for (Booking b : existing) {
            int bStart = seqByStopId.get(b.getFromStop().getId());
            int bEnd = seqByStopId.get(b.getToStop().getId());
            occupied.computeIfAbsent(b.getSeatNo(), k -> new ArrayList<>()).add(new int[]{bStart, bEnd});
        }

        // Validate all requested seats are available
        for (Integer seat : req.getSeatNos()) {
            if (seat < 1 || seat > bus.getTotalSeats())
                throw new IllegalArgumentException("Invalid seat number: " + seat);
            List<int[]> intervals = occupied.getOrDefault(seat, Collections.emptyList());
            boolean overlaps = intervals.stream().anyMatch(iv -> intervalsOverlap(start, end, iv[0], iv[1]));
            if (overlaps) {
                throw new IllegalArgumentException("Seat " + seat + " is not available for the selected segment");
            }
        }

        // Persist one Booking per seat for simplicity
        List<Integer> savedSeats = new ArrayList<>();
        for (Integer seat : req.getSeatNos()) {
            Booking booking = Booking.builder()
                    .user(user)
                    .bus(bus)
                    .seatNo(seat)
                    .fromStop(fromStop)
                    .toStop(toStop)
                    .date(date)
                    .build();
            bookingRepository.save(booking);
            savedSeats.add(seat);
        }

        // Response (not grouping by booking id as multiple rows created)
        return BookingDtos.BookingResponse.builder()
                .bookingId(null)
                .busId(bus.getId())
                .date(date)
                .seatNos(savedSeats)
                .build();
    }

    private boolean intervalsOverlap(int aStart, int aEnd, int bStart, int bEnd) {
        return aStart < bEnd && bStart < aEnd;
    }
}
