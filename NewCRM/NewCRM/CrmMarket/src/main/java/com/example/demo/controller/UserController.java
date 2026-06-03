package com.example.demo.controller;

import com.example.demo.dto.CreateUserRequestDTO;
import com.example.demo.dto.ProfileResponseDTO;
import com.example.demo.dto.UpdateProfileRequestDTO;
import com.example.demo.service.impl.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/profile")
public class UserController {

    @Autowired
    private UserService userService;

    //  CREATE USER (RAW JSON)
    @PostMapping("/create")
    public ResponseEntity<ProfileResponseDTO> createUser(
            @RequestBody CreateUserRequestDTO request) {

        return ResponseEntity.status(201)
                .body(userService.createUser(request));
    }


    @PutMapping("/update/{user}")
    public ResponseEntity<ProfileResponseDTO> updateProfile(
            @PathVariable String user,
            @RequestBody UpdateProfileRequestDTO dto)
            throws IOException {

        return ResponseEntity.ok(userService.updateProfile(user, dto));
    }

    @GetMapping("/image/{fileName}")
    public ResponseEntity<byte[]> getImage(@PathVariable String fileName)
            throws IOException {

        Path path = Paths.get("uploads").resolve(fileName);
        byte[] image = Files.readAllBytes(path);

        return ResponseEntity.ok()
                .header("Content-Type", "image/jpeg")
                .body(image);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<ProfileResponseDTO> getProfileByEmail(
            @PathVariable String email) {

        return ResponseEntity.ok(userService.getProfileByEmail(email));
    }
}