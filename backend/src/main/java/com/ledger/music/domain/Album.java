package com.ledger.music.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "saved_albums", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "apple_catalog_id"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Album {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Apple Catalog ID is required")
    @Column(name = "apple_catalog_id", nullable = false)
    private Long appleCatalogId;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Artist name is required")
    @Column(name = "artist_name", nullable = false)
    private String artistName;

    @NotBlank(message = "Genre is required")
    @Column(nullable = false)
    private String genre;

    @Column(name = "release_date")
    private String releaseDate;

    @Column(name = "track_count")
    private Integer trackCount;

    @Column(name = "artwork_url", length = 1000)
    private String artworkUrl;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    @Column(name = "user_rating")
    private Integer userRating;

    @Column(name = "user_notes", length = 2000)
    private String userNotes;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
