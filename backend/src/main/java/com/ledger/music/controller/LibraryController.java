package com.ledger.music.controller;

import com.ledger.music.dto.AlbumDto;
import com.ledger.music.service.LibraryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/library")
@RequiredArgsConstructor
public class LibraryController {

    private final LibraryService libraryService;

    @GetMapping
    public ResponseEntity<List<AlbumDto>> getLibrary(@AuthenticationPrincipal UserDetails userDetails) {
        List<AlbumDto> library = libraryService.getUserLibrary(userDetails.getUsername());
        return ResponseEntity.ok(library);
    }

    @GetMapping("/page")
    public ResponseEntity<Page<AlbumDto>> getLibraryPaged(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "sortBy", defaultValue = "createdAt") String sortBy,
            @RequestParam(name = "direction", defaultValue = "DESC") String direction) {

        Sort sort = direction.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<AlbumDto> pagedLibrary = libraryService.getUserLibraryPaged(userDetails.getUsername(), PageRequest.of(page, size, sort));
        return ResponseEntity.ok(pagedLibrary);
    }

    @PostMapping
    public ResponseEntity<AlbumDto> saveAlbum(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AlbumDto albumDto) {
        AlbumDto saved = libraryService.saveAlbumToLibrary(userDetails.getUsername(), albumDto);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AlbumDto> updateAlbum(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody AlbumDto albumDto) {
        AlbumDto updated = libraryService.updateAlbum(userDetails.getUsername(), id, albumDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbum(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        libraryService.removeAlbumFromLibrary(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
