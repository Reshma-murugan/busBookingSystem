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

        // Seed Tamil Nadu cities (38 districts)
        List<City> cities = Arrays.asList(
                City.builder().name("Chennai").state("Tamil Nadu").build(),
                City.builder().name("Coimbatore").state("Tamil Nadu").build(),
                City.builder().name("Madurai").state("Tamil Nadu").build(),
                City.builder().name("Tiruchirappalli").state("Tamil Nadu").build(),
                City.builder().name("Salem").state("Tamil Nadu").build(),
                City.builder().name("Tirunelveli").state("Tamil Nadu").build(),
                City.builder().name("Erode").state("Tamil Nadu").build(),
                City.builder().name("Vellore").state("Tamil Nadu").build(),
                City.builder().name("Thoothukudi").state("Tamil Nadu").build(),
                City.builder().name("Dindigul").state("Tamil Nadu").build(),
                City.builder().name("Thanjavur").state("Tamil Nadu").build(),
                City.builder().name("Ranipet").state("Tamil Nadu").build(),
                City.builder().name("Sivaganga").state("Tamil Nadu").build(),
                City.builder().name("Vellore").state("Tamil Nadu").build(),
                City.builder().name("Villupuram").state("Tamil Nadu").build(),
                City.builder().name("Virudhunagar").state("Tamil Nadu").build(),
                City.builder().name("Kanyakumari").state("Tamil Nadu").build(),
                City.builder().name("Kanchipuram").state("Tamil Nadu").build(),
                City.builder().name("Karur").state("Tamil Nadu").build(),
                City.builder().name("Krishnagiri").state("Tamil Nadu").build(),
                City.builder().name("Nagapattinam").state("Tamil Nadu").build(),
                City.builder().name("Namakkal").state("Tamil Nadu").build(),
                City.builder().name("Perambalur").state("Tamil Nadu").build(),
                City.builder().name("Pudukkottai").state("Tamil Nadu").build(),
                City.builder().name("Ramanathapuram").state("Tamil Nadu").build(),
                City.builder().name("Theni").state("Tamil Nadu").build(),
                City.builder().name("Thiruvallur").state("Tamil Nadu").build(),
                City.builder().name("Thiruvarur").state("Tamil Nadu").build(),
                City.builder().name("Tirupattur").state("Tamil Nadu").build(),
                City.builder().name("Tiruppur").state("Tamil Nadu").build(),
                City.builder().name("Tiruvannamalai").state("Tamil Nadu").build(),
                City.builder().name("The Nilgiris").state("Tamil Nadu").build(),
                City.builder().name("Cuddalore").state("Tamil Nadu").build(),
                City.builder().name("Dharmapuri").state("Tamil Nadu").build(),
                City.builder().name("Ariyalur").state("Tamil Nadu").build(),
                City.builder().name("Chengalpattu").state("Tamil Nadu").build(),
                City.builder().name("Kallakurichi").state("Tamil Nadu").build(),
                City.builder().name("Tenkasi").state("Tamil Nadu").build()
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

        // Seed admin user
        User adminUser = User.builder()
                .name("Admin User")
                .email("admin@meghna.com")
                .password(passwordEncoder.encode("admin123"))
                .role("ADMIN")
                .build();
        userRepository.save(adminUser);

        // Seed 35 operational buses + 5 reserved
        List<Bus> buses = Arrays.asList(
                // AC Buses (28 seats each)
                Bus.builder().name("TN-01-AB-1234").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1235").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1236").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1237").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1238").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1239").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1240").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1241").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1242").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1243").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1244").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1245").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1246").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1247").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1248").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1249").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1250").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-01-AB-1251").type("AC").totalSeats(28).build(),
                
                // Non-AC Buses (35 seats each)
                Bus.builder().name("TN-02-CD-5678").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5679").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5680").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5681").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5682").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5683").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5684").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5685").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5686").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5687").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5688").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5689").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5690").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5691").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5692").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5693").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-02-CD-5694").type("NON_AC").totalSeats(35).build(),
                
                // Reserved Buses
                Bus.builder().name("TN-03-EF-9012").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-03-EF-9013").type("AC").totalSeats(28).build(),
                Bus.builder().name("TN-04-GH-3456").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-04-GH-3457").type("NON_AC").totalSeats(35).build(),
                Bus.builder().name("TN-04-GH-3458").type("NON_AC").totalSeats(35).build()
        );
        busRepository.saveAll(buses);

        // Create sample routes with stops
        Bus bus1 = buses.get(0); // First AC bus
        Bus bus2 = buses.get(18); // First Non-AC bus
        
        // Chennai → Madurai route
        List<Stop> chennaiMaduraiStops = Arrays.asList(
                Stop.builder().name("Chennai").sequence(1).bus(bus1).build(),
                Stop.builder().name("Tindivanam").sequence(2).bus(bus1).build(),
                Stop.builder().name("Villupuram").sequence(3).bus(bus1).build(),
                Stop.builder().name("Tiruchirappalli").sequence(4).bus(bus1).build(),
                Stop.builder().name("Madurai").sequence(5).bus(bus1).build()
        );
        stopRepository.saveAll(chennaiMaduraiStops);

        // Coimbatore → Salem route
        List<Stop> coimbatoreSalemStops = Arrays.asList(
                Stop.builder().name("Coimbatore").sequence(1).bus(bus2).build(),
                Stop.builder().name("Erode").sequence(2).bus(bus2).build(),
                Stop.builder().name("Salem").sequence(3).bus(bus2).build()
        );
        stopRepository.saveAll(coimbatoreSalemStops);

        // Seed trips
        LocalDate today = LocalDate.now();
        for (int i = 0; i < 31; i++) { // 31-day planning
            LocalDate tripDate = today.plusDays(i);
            
            Trip trip1 = Trip.builder()
                    .bus(bus1)
                    .tripDate(tripDate)
                    .departureTime(LocalTime.of(22, 0))
                    .arrivalTime(LocalTime.of(6, 0))
                    .price(1200) // Chennai to Madurai AC
                    .build();
            tripRepository.save(trip1);

            Trip trip2 = Trip.builder()
                    .bus(bus2)
                    .tripDate(tripDate)
                    .departureTime(LocalTime.of(8, 0))
                    .arrivalTime(LocalTime.of(11, 0))
                    .price(450) // Coimbatore to Salem Non-AC
                    .build();
            tripRepository.save(trip2);
        }

        // Seed some demo bookings
        Booking booking1 = Booking.builder()
                .pnr("BUS" + System.currentTimeMillis())
                .user(demoUser)
                .bus(bus1)
                .tripDate(today.plusDays(1))
                .fromStop(chennaiMaduraiStops.get(0)) // Chennai
                .toStop(chennaiMaduraiStops.get(4))   // Madurai
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

        // Another booking
        Booking booking2 = Booking.builder()
                .pnr("BUS" + (System.currentTimeMillis() + 1000))
                .user(demoUser)
                .bus(bus2)
                .tripDate(today.plusDays(1))
                .fromStop(coimbatoreSalemStops.get(0)) // Coimbatore
                .toStop(coimbatoreSalemStops.get(2))   // Salem
                .status("CONFIRMED")
                .bookingTime(LocalDateTime.now().minusHours(1))
                .build();
        bookingRepository.save(booking2);

        List<Passenger> passengers2 = Arrays.asList(
                Passenger.builder().booking(booking2).name("Alice Smith").age(25).gender("Female").seatNo(15).build()
        );
        passengerRepository.saveAll(passengers2);

        System.out.println("Meghna Travels database seeded successfully with 40 buses and Tamil Nadu cities!");
    }
}