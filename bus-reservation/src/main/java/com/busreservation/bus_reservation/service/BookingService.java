package com.busreservation.bus_reservation.service;

import com.busreservation.bus_reservation.dto.BookingDtos;
import com.busreservation.bus_reservation.exception.BadRequestException;
import com.busreservation.bus_reservation.exception.NotFoundException;
import com.busreservation.bus_reservation.model.*;
import com.busreservation.bus_reservation.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final BusRepository busRepository;
    private final StopRepository stopRepository;
    private final PassengerRepository passengerRepository;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository,
                         BusRepository busRepository, StopRepository stopRepository,
                         PassengerRepository passengerRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.busRepository = busRepository;
        this.stopRepository = stopRepository;
        this.passengerRepository = passengerRepository;
    }

    @Transactional
    public BookingDtos.BookingResponse createBooking(String userEmail, BookingDtos.BookingRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Bus bus = busRepository.findById(request.getBusId())
                .orElseThrow(() -> new NotFoundException("Bus not found"));

        Stop fromStop = stopRepository.findById(request.getFromStopId())
                .orElseThrow(() -> new NotFoundException("From stop not found"));

        Stop toStop = stopRepository.findById(request.getToStopId())
                .orElseThrow(() -> new NotFoundException("To stop not found"));

        // Validate segment
        if (fromStop.getSequence() >= toStop.getSequence()) {
            throw new BadRequestException("Invalid journey segment");
        }

        // Check seat availability
        Set<Integer> requestedSeats = new HashSet<>(request.getSeatIds());
        Set<Integer> bookedSeats = getBookedSeatsForSegment(
                request.getBusId(), request.getTripDate(), 
                request.getFromStopId(), request.getToStopId());

        for (Integer seatId : requestedSeats) {
            if (bookedSeats.contains(seatId)) {
                throw new BadRequestException("Seat " + seatId + " is not available");
            }
        }

        // Create booking
        String pnr = generatePNR();
        Booking booking = Booking.builder()
                .pnr(pnr)
                .user(user)
                .bus(bus)
                .tripDate(request.getTripDate())
                .fromStop(fromStop)
                .toStop(toStop)
                .status("CONFIRMED")
                .bookingTime(LocalDateTime.now())
                .build();

        booking = bookingRepository.save(booking);

        // Create passengers
        List<Passenger> passengers = new ArrayList<>();
        for (BookingDtos.PassengerInfo passengerInfo : request.getPassengers()) {
            Passenger passenger = Passenger.builder()
                    .booking(booking)
                    .name(passengerInfo.getName())
                    .age(passengerInfo.getAge())
                    .gender(passengerInfo.getGender())
                    .seatNo(passengerInfo.getSeatNo())
                    .build();
            passengers.add(passenger);
        }

        passengerRepository.saveAll(passengers);
        booking.setPassengers(passengers);

        return BookingDtos.BookingResponse.builder()
                .bookingId(booking.getId())
                .pnr(booking.getPnr())
                .status(booking.getStatus())
                .bookingTime(booking.getBookingTime())
                .build();
    }

    public List<BookingDtos.BookingHistoryResponse> getUserBookings(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        List<Booking> bookings = bookingRepository.findByUserIdOrderByBookingTimeDesc(user.getId());

        return bookings.stream()
                .map(booking -> {
                    List<Integer> seats = booking.getPassengers().stream()
                            .map(Passenger::getSeatNo)
                            .sorted()
                            .collect(Collectors.toList());

                    List<BookingDtos.PassengerInfo> passengerInfos = booking.getPassengers().stream()
                            .map(p -> new BookingDtos.PassengerInfo(p.getName(), p.getAge(), p.getGender(), p.getSeatNo()))
                            .collect(Collectors.toList());

                    return BookingDtos.BookingHistoryResponse.builder()
                            .id(booking.getId())
                            .pnr(booking.getPnr())
                            .busName(booking.getBus().getName())
                            .tripDate(booking.getTripDate())
                            .fromStop(booking.getFromStop().getName())
                            .toStop(booking.getToStop().getName())
                            .status(booking.getStatus())
                            .bookingTime(booking.getBookingTime())
                            .seats(seats)
                            .passengers(passengerInfos)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private Set<Integer> getBookedSeatsForSegment(Long busId, java.time.LocalDate date, Long fromStopId, Long toStopId) {
        List<Booking> bookings = bookingRepository.findByBusIdAndTripDate(busId, date);
        Set<Integer> bookedSeats = new HashSet<>();

        Map<Long, Integer> stopSequences = stopRepository.findByBusIdOrderBySequenceAsc(busId)
                .stream()
                .collect(Collectors.toMap(Stop::getId, Stop::getSequence));

        Integer requestFromSeq = stopSequences.get(fromStopId);
        Integer requestToSeq = stopSequences.get(toStopId);

        if (requestFromSeq == null || requestToSeq == null) {
            return bookedSeats;
        }

        for (Booking booking : bookings) {
            if (!"CONFIRMED".equals(booking.getStatus())) continue;

            Integer bookingFromSeq = stopSequences.get(booking.getFromStop().getId());
            Integer bookingToSeq = stopSequences.get(booking.getToStop().getId());

            if (bookingFromSeq != null && bookingToSeq != null) {
                // Check if segments overlap
                if (requestFromSeq < bookingToSeq && bookingFromSeq < requestToSeq) {
                    booking.getPassengers().forEach(passenger -> 
                            bookedSeats.add(passenger.getSeatNo()));
                }
            }
        }

        return bookedSeats;
    }

    private String generatePNR() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.format("%04d", new Random().nextInt(10000));
        return "BUS" + timestamp.substring(8) + random;
    }
}