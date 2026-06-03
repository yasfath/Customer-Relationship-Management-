package com.example.demo.service.impl;

import com.example.demo.Exceptions.BadRequestException;
import com.example.demo.dto.CreateUserRequestDTO;
import com.example.demo.dto.ProfileResponseDTO;
import com.example.demo.dto.UpdateProfileRequestDTO;
import com.example.demo.entity.Staff;
import com.example.demo.entity.User;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import java.util.Base64;
import java.util.Optional;
import java.util.concurrent.ThreadLocalRandom;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private StaffRepository staffRepository;

    private static final String UPLOAD_DIR = "uploads";

    // =========================
    // CREATE USER
    // =========================
    public ProfileResponseDTO createUser(CreateUserRequestDTO dto) {

        validateCreateUserRequest(dto);

        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        User user = new User();

        user.setId(generateUniqueUserId());
        user.setFullName(dto.getFullName());
        user.setEmail(dto.getEmail().trim());
        user.setUserName(dto.getUserName().trim());
        user.setRole(dto.getRole().trim());
        user.setPhoneNumber(normalize(dto.getPhoneNumber()));
        user.setLocation(normalize(dto.getLocation()));
        user.setBio(normalize(dto.getBio()));

        String encryptedPassword = passwordEncoder.encode(dto.getPassword());
        user.setPassword(encryptedPassword);

        User savedUser;

        try {
            savedUser = userRepository.saveAndFlush(user);
        } catch (DataIntegrityViolationException ex) {
            throw new BadRequestException("Unable to create account. Email or profile data already exists.");
        }

        return mapToResponse(savedUser);
    }


    // =========================
    // UPDATE PROFILE
    // =========================
    public ProfileResponseDTO updateProfile(String email,
                                            UpdateProfileRequestDTO dto)
            throws IOException {

        Path uploadPath = Paths.get(UPLOAD_DIR);

        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 1️⃣ Try USER
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {

            User user = userOpt.get();

            updateCommonFields(user, dto);

            if (dto.getRole() != null && !dto.getRole().isBlank())
                user.setRole(dto.getRole());

            User savedUser = userRepository.save(user);

            return mapToResponse(savedUser);
        }

        // 2️⃣ Try STAFF
        Staff staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        updateCommonFields(staff, dto);

        staffRepository.save(staff);

        return mapStaffToResponse(staff);
    }

    // =========================
    // DTO MAPPER
    // =========================
    private ProfileResponseDTO mapToResponse(User user) {

        ProfileResponseDTO response = new ProfileResponseDTO();


        response.setProfileId(user.getProfileId());
        response.setUserName(user.getUserName());
        response.setFullName(user.getFullName());
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setLocation(user.getLocation());
        response.setBio(user.getBio());

        if (user.getProfileImage() != null &&
                !user.getProfileImage().isBlank()) {

            String imageUrl = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/api/profile/image/")
                    .path(user.getProfileImage())
                    .toUriString();

            response.setProfileImageUrl(imageUrl);
        }

        return response;
    }

    private ProfileResponseDTO mapStaffToResponse(Staff staff) {

        ProfileResponseDTO response = new ProfileResponseDTO();

        response.setId(staff.getStaffId());
        response.setFullName(staff.getName());
        response.setEmail(staff.getEmail());
        response.setRole(staff.getRole().name());
        response.setPhoneNumber(staff.getPhoneNumber());
        response.setLocation(staff.getLocation());
        response.setBio(staff.getBio());
        response.setProfileId(staff.getProfileId());

        if (staff.getProfileImage() != null) {

            String imageUrl = ServletUriComponentsBuilder
                    .fromCurrentContextPath()
                    .path("/api/profile/image/")
                    .path(staff.getProfileImage())
                    .toUriString();

            response.setProfileImageUrl(imageUrl);
        }

        return response;
    }


    private void updateCommonFields(Object entity,
                                    UpdateProfileRequestDTO dto)
            throws IOException {

        String fileName = null;

        if (dto.getProfileImageUrl() != null &&
                dto.getProfileImageUrl().startsWith("data:image")) {

            String base64Image = dto.getProfileImageUrl();
            base64Image = base64Image.substring(base64Image.indexOf(",") + 1);

            byte[] imageBytes = Base64.getDecoder().decode(base64Image);

            fileName = UUID.randomUUID() + ".jpg";

            Path filePath = Paths.get(UPLOAD_DIR).resolve(fileName);
            Files.write(filePath, imageBytes);
        }

        if (entity instanceof User user) {

            if (dto.getFullName() != null) user.setFullName(dto.getFullName());
            if (dto.getPhoneNumber() != null) user.setPhoneNumber(dto.getPhoneNumber());
            if (dto.getLocation() != null) user.setLocation(dto.getLocation());
            if (dto.getBio() != null) user.setBio(dto.getBio());

            if (fileName != null)
                user.setProfileImage(fileName);

        } else if (entity instanceof Staff staff) {

            if (dto.getFullName() != null) staff.setName(dto.getFullName());
            if (dto.getPhoneNumber() != null) staff.setPhoneNumber(dto.getPhoneNumber());
            if (dto.getLocation() != null) staff.setLocation(dto.getLocation());
            if (dto.getBio() != null) staff.setBio(dto.getBio());

            if (fileName != null)
                staff.setProfileImage(fileName);
        }
    }

    public ProfileResponseDTO getProfileByEmail(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ProfileResponseDTO response = new ProfileResponseDTO();

        response.setId(user.getId());
        response.setFullName(user.getFullName());
        response.setEmail(user.getEmail());
        response.setRole(user.getRole());
        response.setPhoneNumber(user.getPhoneNumber());
        response.setLocation(user.getLocation());
        response.setBio(user.getBio());
        response.setProfileImageUrl(user.getProfileImage());

        return response;
    }

    private void validateCreateUserRequest(CreateUserRequestDTO dto) {

        if (dto == null) {
            throw new BadRequestException("Request body is required");
        }

        if (isBlank(dto.getUserName())) {
            throw new BadRequestException("Username is required");
        }

        if (isBlank(dto.getFullName())) {
            throw new BadRequestException("Full name is required");
        }

        if (isBlank(dto.getEmail())) {
            throw new BadRequestException("Email is required");
        }

        if (isBlank(dto.getRole())) {
            throw new BadRequestException("Role is required");
        }

        if (isBlank(dto.getPassword())) {
            throw new BadRequestException("Password is required");
        }
    }

    private Long generateUniqueUserId() {

        for (int attempt = 0; attempt < 10; attempt++) {
            long candidate = ThreadLocalRandom.current().nextLong(1, 10_000_000);

            if (!userRepository.existsById(candidate)) {
                return candidate;
            }
        }

        throw new BadRequestException("Unable to generate a unique user id. Please try again.");
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }

}
