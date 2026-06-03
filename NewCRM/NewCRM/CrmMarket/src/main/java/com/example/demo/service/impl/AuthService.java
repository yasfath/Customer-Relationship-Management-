package com.example.demo.service.impl;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.Configuration.BrevoEmailService;
import com.example.demo.Configuration.JwtUtil;
import com.example.demo.Configuration.TenantContext;
import com.example.demo.dto.AuthResponseDTO;
import com.example.demo.dto.LoginRequestDTO;
import com.example.demo.dto.ResetPasswordRequestDTO;
import com.example.demo.dto.VerifyOtpRequestDTO;
import com.example.demo.entity.BlacklistedToken;
import com.example.demo.entity.Staff;
import com.example.demo.entity.User;
import com.example.demo.repository.BlacklistedTokenRepository;
import com.example.demo.repository.StaffRepository;
import com.example.demo.repository.UserRepository;

@Service
public class AuthService {

    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailServiceImpl emailService;
    private final BlacklistedTokenRepository blacklistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BrevoEmailService brevoEmailService;

    public AuthService(
            StaffRepository staffRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            EmailServiceImpl emailService,
            BlacklistedTokenRepository blacklistRepository) {

        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
        this.blacklistRepository = blacklistRepository;
    }

    // ================= LOGIN =================
    public AuthResponseDTO login(LoginRequestDTO request) {

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {

            User user = userOpt.get();

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new RuntimeException("Invalid email or password");
            }

            String token = jwtUtil.generateToken(
                    user.getEmail(),
                    user.getRole(),
                    user.getProfileId(),
                    user.getId()
            );

            String imageUrl = null;

            if (user.getProfileImage() != null) {
                imageUrl = "http://10.113.28.12:8080/api/profile/image/" + user.getProfileImage();
            }

            return new AuthResponseDTO(
                    token,
                    user.getRole(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getPhoneNumber(),
                    user.getLocation(),
                    user.getBio(),
                    imageUrl,
                    user.getUserName(),
                    user.getProfileId(),
                    user.getId()
            );
        }

        Staff staff = staffRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), staff.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                staff.getEmail(),
                staff.getRole().name(),
                staff.getProfileId(),
                staff.getStaffId()
        );

        String imageUrl = null;

        if (staff.getProfileImage() != null) {
           imageUrl = "http://10.113.28.12:8080/api/profile/image/" + staff.getProfileImage();
        }

        return new AuthResponseDTO(
                token,
                staff.getRole().name(),
                staff.getEmail(),
                staff.getName(),
                staff.getPhoneNumber(),
                staff.getLocation(),
                staff.getBio(),
                imageUrl,
                staff.getName(),
                staff.getProfileId(),
                staff.getStaffId()
        );
    }

    // ================= CHANGE PASSWORD =================
    public void changePassword(String email, String oldPassword, String newPassword) {

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {

            User user = userOpt.get();

            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                throw new RuntimeException("Old password incorrect");
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            return;
        }

        Staff staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(oldPassword, staff.getPassword())) {
            throw new RuntimeException("Old password incorrect");
        }

        staff.setPassword(passwordEncoder.encode(newPassword));
        staffRepository.save(staff);
    }

    // ================= FORGOT PASSWORD =================
    public void forgotPassword(String email) {

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {

            User user = userOpt.get();

            String token = UUID.randomUUID().toString();

            user.setResetToken(token);
            user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));

            userRepository.save(user);
            System.out.println("Reset Token = " + token);
            return;
        }

        Staff staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        String token = UUID.randomUUID().toString();

        staff.setResetToken(token);
        staff.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));

        staffRepository.save(staff);
        System.out.println("Reset Token = " + token);
    }

    // ================= RESET CHANGE PASSWORD =================
    public void resetChangePassword(ResetPasswordRequestDTO request) {

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {

            User user = userOpt.get();

            if (!Boolean.TRUE.equals(user.getOtpVerified())) {
                throw new RuntimeException("OTP not verified");
            }

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            user.setResetOtp(null);
            user.setOtpExpiry(null);
            user.setOtpVerified(false);

            userRepository.save(user);
            return;
        }

        Staff staff = staffRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        staff.setPassword(passwordEncoder.encode(request.getNewPassword()));
        staff.setResetToken(null);
        staff.setResetTokenExpiry(null);

        staffRepository.save(staff);
    }

    // ================= RESET PASSWORD =================
    public void resetPassword(String token, String newPassword) {

        Optional<User> userOpt = userRepository.findByResetToken(token);

        if (userOpt.isPresent()) {

            User user = userOpt.get();

            if (user.getResetTokenExpiry() == null ||
                    user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("Reset token expired");
            }

            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetToken(null);
            user.setResetTokenExpiry(null);

            userRepository.save(user);
            return;
        }

        Staff staff = staffRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid reset token"));

        if (staff.getResetTokenExpiry() == null ||
                staff.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token expired");
        }

        staff.setPassword(passwordEncoder.encode(newPassword));
        staff.setResetToken(null);
        staff.setResetTokenExpiry(null);

        staffRepository.save(staff);
    }

    // ================= LOGOUT =================
    public void logout(String token) {

        String profileId = TenantContext.getCurrentTenant();

        BlacklistedToken blacklisted = new BlacklistedToken();
        blacklisted.setToken(token);
        blacklisted.setExpiryDate(jwtUtil.extractExpiration(token));
        blacklisted.setProfileId(profileId);

        blacklistRepository.save(blacklisted);
    }

    // ================= OTP =================
    public void sendOtp(String email) {

        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) {

            User user = userOpt.get();
            String otp = generateOtp();

            user.setResetOtp(passwordEncoder.encode(otp));
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(1));
            user.setOtpVerified(false);

            userRepository.save(user);

            brevoEmailService.sendOtpEmail(user.getEmail(), user.getFullName(), otp);
            return;
        }

        Staff staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        String otp = generateOtp();

        staff.setResetToken(passwordEncoder.encode(otp));
        staff.setResetTokenExpiry(LocalDateTime.now().plusMinutes(1));

        staffRepository.save(staff);

        brevoEmailService.sendOtpEmail(staff.getEmail(), staff.getName(), otp);
    }

    public void verifyOtp(VerifyOtpRequestDTO request) {

        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isPresent()) {

            User user = userOpt.get();

            if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
                throw new RuntimeException("OTP expired");
            }

            boolean valid = passwordEncoder.matches(
                    request.getOtp(),
                    user.getResetOtp()
            );

            if (!valid) {
                throw new RuntimeException("Invalid OTP");
            }

            user.setOtpVerified(true);
            userRepository.save(user);
            return;
        }

        Staff staff = staffRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (staff.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        boolean valid = passwordEncoder.matches(
                request.getOtp(),
                staff.getResetToken()
        );

        if (!valid) {
            throw new RuntimeException("Invalid OTP");
        }

        staffRepository.save(staff);
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}