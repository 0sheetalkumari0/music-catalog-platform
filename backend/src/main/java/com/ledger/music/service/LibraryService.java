package com.ledger.music.service;

import com.ledger.music.domain.Album;
import com.ledger.music.domain.User;
import com.ledger.music.dto.AlbumDto;
import com.ledger.music.exception.DuplicateResourceException;
import com.ledger.music.exception.ResourceNotFoundException;
import com.ledger.music.repository.AlbumRepository;
import com.ledger.music.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LibraryService {

    private final AlbumRepository albumRepository;
    private final UserRepository userRepository;

    public List<AlbumDto> getUserLibrary(String username) {
        User user = getUserByUsername(username);
        return albumRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public Page<AlbumDto> getUserLibraryPaged(String username, Pageable pageable) {
        User user = getUserByUsername(username);
        return albumRepository.findByUserId(user.getId(), pageable)
                .map(this::mapToDto);
    }

    public AlbumDto saveAlbumToLibrary(String username, AlbumDto albumDto) {
        User user = getUserByUsername(username);

        if (albumRepository.existsByUserIdAndAppleCatalogId(user.getId(), albumDto.getAppleCatalogId())) {
            throw new DuplicateResourceException("Album with Apple Catalog ID " + albumDto.getAppleCatalogId() + " is already in your library");
        }

        Album album = Album.builder()
                .appleCatalogId(albumDto.getAppleCatalogId())
                .title(albumDto.getTitle())
                .artistName(albumDto.getArtistName())
                .genre(albumDto.getGenre())
                .releaseDate(albumDto.getReleaseDate())
                .trackCount(albumDto.getTrackCount())
                .artworkUrl(albumDto.getArtworkUrl())
                .userRating(albumDto.getUserRating() != null ? albumDto.getUserRating() : 5)
                .userNotes(albumDto.getUserNotes())
                .userId(user.getId())
                .build();

        Album saved = albumRepository.save(album);
        return mapToDto(saved);
    }

    public AlbumDto updateAlbum(String username, Long id, AlbumDto albumDto) {
        User user = getUserByUsername(username);

        Album album = albumRepository.findByUserIdAndId(user.getId(), id)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found in library with ID: " + id));

        if (albumDto.getUserRating() != null) {
            album.setUserRating(albumDto.getUserRating());
        }
        if (albumDto.getUserNotes() != null) {
            album.setUserNotes(albumDto.getUserNotes());
        }
        if (albumDto.getTitle() != null) {
            album.setTitle(albumDto.getTitle());
        }

        Album updated = albumRepository.save(album);
        return mapToDto(updated);
    }

    public void removeAlbumFromLibrary(String username, Long id) {
        User user = getUserByUsername(username);
        Album album = albumRepository.findByUserIdAndId(user.getId(), id)
                .orElseThrow(() -> new ResourceNotFoundException("Album not found in library with ID: " + id));
        albumRepository.delete(album);
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    private AlbumDto mapToDto(Album album) {
        return AlbumDto.builder()
                .id(album.getId())
                .appleCatalogId(album.getAppleCatalogId())
                .title(album.getTitle())
                .artistName(album.getArtistName())
                .genre(album.getGenre())
                .releaseDate(album.getReleaseDate())
                .trackCount(album.getTrackCount())
                .artworkUrl(album.getArtworkUrl())
                .userRating(album.getUserRating())
                .userNotes(album.getUserNotes())
                .createdAt(album.getCreatedAt())
                .updatedAt(album.getUpdatedAt())
                .build();
    }
}
