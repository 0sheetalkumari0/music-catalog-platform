package com.ledger.music.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InsightResponse {
    private String tasteProfileSummary;
    private String primaryGenre;
    private String favoriteEra;
    private Map<String, Long> genreBreakdown;
    private Map<String, Long> eraBreakdown;
    private List<RecommendedAlbum> recommendations;
    private List<String> catalogKeyTakeaways;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RecommendedAlbum {
        private String title;
        private String artistName;
        private String genre;
        private String matchReason;
        private String sampleQuery;
    }
}
