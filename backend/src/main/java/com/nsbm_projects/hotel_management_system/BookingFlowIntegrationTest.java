package com.nsbm_projects.hotel_management_system;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nsbm_projects.hotel_management_system.dto.BookingRequest;
import com.nsbm_projects.hotel_management_system.model.Room;
import com.nsbm_projects.hotel_management_system.model.RoomStatus;
import com.nsbm_projects.hotel_management_system.model.User;
import com.nsbm_projects.hotel_management_system.repository.RoomRepository;
import com.nsbm_projects.hotel_management_system.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BookingFlowIntegrationTest {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    BookingFlowIntegrationTest(MockMvc mockMvc,
                               ObjectMapper objectMapper,
                               RoomRepository roomRepository,
                               UserRepository userRepository) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Test
    @WithMockUser(roles = {"USER"})
    void createBooking_shouldReturn200() throws Exception {
        User u = userRepository.save(new User(null, "guest1", "guest1@test.com", "x", "Guest One", true, new java.util.HashSet<>()));
        Room r = new Room(null, "R-101", "Single", new BigDecimal("100.00"), true, RoomStatus.AVAILABLE);
        r = roomRepository.save(r);

        BookingRequest req = new BookingRequest();
        req.setGuestId(u.getId());
        req.setRoomId(r.getId());
        req.setCheckInDate(LocalDate.now().plusDays(1));
        req.setCheckOutDate(LocalDate.now().plusDays(2));

        mockMvc.perform(post("/api/bookings")
                        .contentType(APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());
    }
}
