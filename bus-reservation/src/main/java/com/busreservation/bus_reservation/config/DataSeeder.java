package com.busreservation.bus_reservation.config;

import com.busreservation.bus_reservation.model.*;
import com.busreservation.bus_reservation.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CityRepository cityRepository;
    private final BusRepository busRepository;
    private final StopRepository stopRepository;
    private final TripRepository tripRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final PassengerRepository passengerRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(CityRepository cityRepository, BusRepository busRepository,
                     StopRepository stopRepository, TripRepository tripRepository,
                     UserRepository userRepository, BookingRepository bookingRepository,
                     PassengerRepository passengerRepository, PasswordEncoder passwordEncoder) {
        this.cityRepository = cityRepository;
        this.busRepository = busRepository;
        this.stopRepository = stopRepository;
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.passengerRepository = passengerRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (cityRepository.count() > 0) {
            return; // Data already seeded
        }

        // Seed cities
        List<City> cities = Arrays.asList(
                City.builder().name("Chennai").state("Tamil Nadu").build(),
                City.builder().name("Villupuram").state("Tamil Nadu").build(),
                City.builder().name("Salem").state("Tamil Nadu").build(),
                City.builder().name("Erode").state("Tamil Nadu").build(),
                City.builder().name("Coimbatore").state("Tamil Nadu").build(),
                City.builder().name("Bangalore").state("Karnataka").build(),
                City.builder().name("Mysore").state("Karnataka").build(),
                City.builder().name("Kochi").state("Kerala").build()
        );
        cityRepository.saveAll(cities);

        // Seed demo user
        User demoUser = User.builder()
                .name("Demo User")
                .email("demo@user.com")
                .password(passwordEncoder.encode("password"))
                .role("USER")
                .build();
        userRepository.save(demoUser);

        // Seed buses
        Bus bus1 = Bus.builder()
                .name("Express Travels")
                .type("AC Sleeper")
                .totalSeats(28)
                .build();
        busRepository.save(bus1);

        Bus bus2 = Bus.builder()
                .name("Comfort Lines")
                .type("Non-AC Seater")
                .totalSeats(32)
                .build();
        busRepository.save(bus2);

        // Seed stops for bus1
        List<Stop> bus1Stops = Arrays.asList(
                Stop.builder().name("Chennai").sequence(1).bus(bus1).build(),
                Stop.builder().name("Villupuram").sequence(2).bus(bus1).build(),
                Stop.builder().name("Salem").sequence(3).bus(bus1).build(),
                Stop.builder().name("Erode").sequence(4).bus(bus1).build(),
                Stop.builder().name("Coimbatore").sequence(5).bus(bus1).build()
        );
        stopRepository.saveAll(bus1Stops);

        // Seed stops for bus2
        List<Stop> bus2Stops = Arrays.asList(
                Stop.builder().name("Chennai").sequence(1).bus(bus2).build(),
                Stop.builder().name("Bangalore").sequence(2).bus(bus2).build(),
                Stop.builder().name("Mysore").sequence(3).bus(bus2).build()
        );
        stopRepository.saveAll(bus2Stops);

        // Seed trips
        LocalDate today = LocalDate.now();
        for (int i = 0; i < 7; i++) {
            LocalDate tripDate = today.plusDays(i);
            
            Trip trip1 = Trip.builder()
                    .bus(bus1)
                    .tripDate(tripDate)
                    .departureTime(LocalTime.of(22, 0))
                    .arrivalTime(LocalTime.of(6, 0))
                    .price(800)
                    .build();
            tripRepository.save(trip1);

            Trip trip2 = Trip.builder()
                    .bus(bus2)
                    .tripDate(tripDate)
                    .departureTime(LocalTime.of(8, 0))
                    .arrivalTime(LocalTime.of(16, 0))
                    .price(500)
                    .build();
            tripRepository.save(trip2);
        }

        // Seed some demo bookings
        Booking booking1 = Booking.builder()
                .pnr("BUS" + System.currentTimeMillis())
                .user(demoUser)
                .bus(bus1)
                .tripDate(today.plusDays(1))
                .fromStop(bus1Stops.get(0)) // Chennai
                .toStop(bus1Stops.get(2))   // Salem
                .status("CONFIRMED")
                .bookingTime(LocalDateTime.now().minusHours(2))
                .build();
        bookingRepository.save(booking1);

        // Add passengers for booking1
        List<Passenger> passengers1 = Arrays.asList(
                Passenger.builder().booking(booking1).name("John Doe").age(30).gender("Male").seatNo(1).build(),
                Passenger.builder().booking(booking1).name("Jane Doe").age(28).gender("Female").seatNo(2).build()
        );
        passengerRepository.saveAll(passengers1);

        // Another booking with different segment
        Booking booking2 = Booking.builder()
                .pnr("BUS" + (System.currentTimeMillis() + 1000))
                .user(demoUser)
                .bus(bus1)
                .tripDate(today.plusDays(1))
                .fromStop(bus1Stops.get(2)) // Salem
                .toStop(bus1Stops.get(4))   // Coimbatore
                .status("CONFIRMED")
                .bookingTime(LocalDateTime.now().minusHours(1))
                .build();
        bookingRepository.save(booking2);

        List<Passenger> passengers2 = Arrays.asList(
                Passenger.builder().booking(booking2).name("Alice Smith").age(25).gender("Female").seatNo(1).build()
        );
        passengerRepository.saveAll(passengers2);

        System.out.println("Database seeded successfully!");
    }
}