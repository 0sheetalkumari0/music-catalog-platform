package com.ledger.music.service;

import com.ledger.music.domain.Album;
import com.ledger.music.domain.User;
import com.ledger.music.dto.AlbumDto;
import com.ledger.music.exception.DuplicateResourceException;
import com.ledger.music.exception.ResourceNotFoundException;
import com.ledger.music.repository.AlbumRepository;
import com.ledger.music.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class LibraryServiceTest {

    @Mock
    private AlbumRepository albumRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private LibraryService libraryService;

    private User testUser;
    private Album testAlbum;
    private AlbumDto testAlbumDto;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .password("password")
                .role("ROLE_USER")
                .build();

        testAlbum = Album.builder()
                .id(10L)
                .appleCatalogId(1440806041L)
                .title("Parachutes")
                .artistName("Coldplay")
                .genre("Alternative")
                .userRating(5)
                .userId(1L)
                .build();

        testAlbumDto = AlbumDto.builder()
                .appleCatalogId(1440806041L)
                .title("Parachutes")
                .artistName("Coldplay")
                .genre("Alternative")
                .userRating(5)
                .build();
    }

    @Test
    void getUserLibrary_ShouldReturnAlbumList() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(albumRepository.findByUserId(1L)).thenReturn(List.of(testAlbum));

        List<AlbumDto> result = libraryService.getUserLibrary("testuser");

        assertEquals(1, result.size());
        assertEquals("Parachutes", result.get(0).getTitle());
        assertEquals("Coldplay", result.get(0).getArtistName());
    }

    @Test
    void saveAlbumToLibrary_ShouldSaveNewAlbum() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(albumRepository.existsByUserIdAndAppleCatalogId(1L, 1440806041L)).thenReturn(false);
        when(albumRepository.save(any(Album.class))).thenReturn(testAlbum);

        AlbumDto saved = libraryService.saveAlbumToLibrary("testuser", testAlbumDto);

        assertNotNull(saved);
        assertEquals("Parachutes", saved.getTitle());
        verify(albumRepository, times(1)).save(any(Album.class));
    }

    @Test
    void saveAlbumToLibrary_DuplicateAlbum_ShouldThrowException() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(albumRepository.existsByUserIdAndAppleCatalogId(1L, 1440806041L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            libraryService.saveAlbumToLibrary("testuser", testAlbumDto);
        });
    }

    @Test
    void updateAlbum_ShouldModifyUserRating() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(albumRepository.findByUserIdAndId(1L, 10L)).thenReturn(Optional.of(testAlbum));
        when(albumRepository.save(any(Album.class))).thenReturn(testAlbum);

        AlbumDto updateRequest = AlbumDto.builder()
                .userRating(4)
                .userNotes("Updated note")
                .build();

        AlbumDto updated = libraryService.updateAlbum("testuser", 10L, updateRequest);

        assertNotNull(updated);
        verify(albumRepository, times(1)).save(testAlbum);
    }

    @Test
    void removeAlbumFromLibrary_ShouldDeleteAlbum() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(albumRepository.findByUserIdAndId(1L, 10L)).thenReturn(Optional.of(testAlbum));

        libraryService.removeAlbumFromLibrary("testuser", 10L);

        verify(albumRepository, times(1)).delete(testAlbum);
    }

    @Test
    void removeAlbumFromLibrary_NotFound_ShouldThrowException() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(albumRepository.findByUserIdAndId(1L, 999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            libraryService.removeAlbumFromLibrary("testuser", 999L);
        });
    }
}
