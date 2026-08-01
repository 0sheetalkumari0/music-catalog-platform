package com.ledger.music.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ItunesSearchResponse {
    private int resultCount;
    private List<ItunesResult> results;
    private boolean cached;

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ItunesResult {
        private Long collectionId;
        private Long trackId;
        private Long artistId;
        private String collectionName;
        private String trackName;
        private String artistName;
        private String primaryGenreName;
        private String releaseDate;
        private Integer trackCount;
        private Double collectionPrice;
        private String artworkUrl100;
        private String wrapperType;
        private String collectionType;
    }
}
