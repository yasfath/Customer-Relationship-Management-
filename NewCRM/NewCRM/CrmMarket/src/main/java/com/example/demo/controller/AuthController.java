package com.example.demo.controller;

import com.example.demo.dto.*;
import com.example.demo.service.impl.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(
            @RequestBody LoginRequestDTO request) {

        return ResponseEntity.ok(authService.login(request));
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequestDTO request) {

        try {

            authService.sendOtp(request.getEmail());

            return ResponseEntity.ok("OTP sent");

        } catch (RuntimeException ex) {

            return ResponseEntity.badRequest().body(ex.getMessage());

        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(
            @RequestBody VerifyOtpRequestDTO request) {

        try {

            authService.verifyOtp(request);

            return ResponseEntity.ok("OTP verified");

        } catch (Exception e) {

            e.printStackTrace(); // prints full error in console

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestBody ResetPasswordRequestDTO request) {

        authService.resetPassword(
                request.getToken(),
                request.getNewPassword()
        );

        return ResponseEntity.ok("Password reset successful");
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(
            @RequestBody ForgotPasswordRequestDTO request) {

        authService.sendOtp(request.getEmail());
        return ResponseEntity.ok("OTP resent");
    }

    @PostMapping("/change/reset-password")
    public ResponseEntity<?> resetChangePassword(
            @RequestBody ResetPasswordRequestDTO request) {

        authService.resetChangePassword(request);
        return ResponseEntity.ok("Password reset successful");
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            Principal principal,
            @RequestBody ChangePasswordRequestDTO request) {

        authService.changePassword(
                principal.getName(),
                request.getOldPassword(),
                request.getNewPassword()
        );

        return ResponseEntity.ok("Password changed successfully");
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(
            @RequestBody LogoutRequestDTO request) {

        if (request == null || request.getToken() == null) {
            return ResponseEntity.badRequest().body("Token is required");
        }
                System.out.println("logout "+request);
        authService.logout(request.getToken());

        return ResponseEntity.ok("Logged out successfully");
    }

}
