package com.ledger.music.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlbumDto {
    private Long id;

    @NotNull(message = "Apple Catalog ID is required")
    private Long appleCatalogId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Artist name is required")
    private String artistName;

    @NotBlank(message = "Genre is required")
    private String genre;

    private String releaseDate;
    private Integer trackCount;
    private String artworkUrl;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer userRating;

    private String userNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
