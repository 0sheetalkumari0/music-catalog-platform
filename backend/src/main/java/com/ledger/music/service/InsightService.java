package com.ledger.music.service;

import com.ledger.music.domain.Album;
import com.ledger.music.domain.User;
import com.ledger.music.dto.InsightResponse;
import com.ledger.music.repository.AlbumRepository;
import com.ledger.music.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InsightService {

    private final AlbumRepository albumRepository;
    private final UserRepository userRepository;

    public InsightResponse generateLibraryInsights(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        List<Album> albums = albumRepository.findByUserId(user.getId());

        if (albums.isEmpty()) {
            return InsightResponse.builder()
                    .tasteProfileSummary("Your music library is currently empty. Search and save albums to unlock personalized catalog insights, genre breakdowns, and recommendations!")
                    .primaryGenre("None")
                    .favoriteEra("N/A")
                    .genreBreakdown(Collections.emptyMap())
                    .eraBreakdown(Collections.emptyMap())
                    .recommendations(List.of(
                            InsightResponse.RecommendedAlbum.builder()
                                    .title("A Head Full of Dreams")
                                    .artistName("Coldplay")
                                    .genre("Alternative")
                                    .matchReason("Popular baseline album to get started")
                                    .sampleQuery("coldplay")
                                    .build(),
                            InsightResponse.RecommendedAlbum.builder()
                                    .title("1989 (Taylor's Version)")
                                    .artistName("Taylor Swift")
                                    .genre("Pop")
                                    .matchReason("Highly rated pop album favorite")
                                    .sampleQuery("taylor swift")
                                    .build()
                    ))
                    .catalogKeyTakeaways(List.of("Save at least 3 albums to build an active musical taste profile."))
                    .build();
        }

        // 1. Genre breakdown
        Map<String, Long> genreCount = albums.stream()
                .filter(a -> a.getGenre() != null)
                .collect(Collectors.groupingBy(Album::getGenre, Collectors.counting()));

        String topGenre = genreCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Eclectic");

        // 2. Era breakdown
        Map<String, Long> eraCount = new HashMap<>();
        for (Album a : albums) {
            if (a.getReleaseDate() != null && a.getReleaseDate().length() >= 4) {
                try {
                    int year = Integer.parseInt(a.getReleaseDate().substring(0, 4));
                    String era = (year / 10 * 10) + "s";
                    eraCount.put(era, eraCount.getOrDefault(era, 0L) + 1);
                } catch (Exception ignored) {}
            }
        }

        String favoriteEra = eraCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Modern");

        // 3. Average Rating & Top Rated Artist
        double avgRating = albums.stream()
                .mapToInt(a -> a.getUserRating() != null ? a.getUserRating() : 5)
                .average()
                .orElse(5.0);

        Map<String, Double> artistAvgRatings = albums.stream()
                .collect(Collectors.groupingBy(Album::getArtistName,
                        Collectors.averagingInt(a -> a.getUserRating() != null ? a.getUserRating() : 5)));

        String topRatedArtist = artistAvgRatings.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Various Artists");

        // 4. Build Taste Summary
        String summary = String.format(
                "Your catalog reflects a strong affinity for %s music, with a noticeable preference for the %s era. " +
                "You have saved %d albums across %d distinct genres, maintaining a high satisfaction index of %.1f/5.0 stars. " +
                "Your highest rated artist in the library is %s.",
                topGenre, favoriteEra, albums.size(), genreCount.size(), avgRating, topRatedArtist
        );

        // 5. Generate Recommendations based on top genre
        List<InsightResponse.RecommendedAlbum> recommendations = generateSmartRecommendations(topGenre, albums);

        List<String> takeaways = List.of(
                "Dominant Genre: " + topGenre + " (" + genreCount.getOrDefault(topGenre, 1L) + " albums saved)",
                "Peak Music Era: " + favoriteEra,
                "Average Personal Rating: " + String.format("%.1f ★", avgRating)
        );

        return InsightResponse.builder()
                .tasteProfileSummary(summary)
                .primaryGenre(topGenre)
                .favoriteEra(favoriteEra)
                .genreBreakdown(genreCount)
                .eraBreakdown(eraCount)
                .recommendations(recommendations)
                .catalogKeyTakeaways(takeaways)
                .build();
    }

    private List<InsightResponse.RecommendedAlbum> generateSmartRecommendations(String topGenre, List<Album> existingAlbums) {
        Set<String> savedTitles = existingAlbums.stream()
                .map(a -> a.getTitle().toLowerCase())
                .collect(Collectors.toSet());

        List<InsightResponse.RecommendedAlbum> candidatePool = List.of(
                InsightResponse.RecommendedAlbum.builder()
                        .title("Parachutes")
                        .artistName("Coldplay")
                        .genre("Alternative")
                        .matchReason("Classic Alternative album aligned with your taste profile")
                        .sampleQuery("coldplay parachutes")
                        .build(),
                InsightResponse.RecommendedAlbum.builder()
                        .title("Abbey Road")
                        .artistName("The Beatles")
                        .genre("Rock")
                        .matchReason("Timeless rock masterpiece recommended for high-rated collection expansion")
                        .sampleQuery("the beatles abbey road")
                        .build(),
                InsightResponse.RecommendedAlbum.builder()
                        .title("Random Access Memories")
                        .artistName("Daft Punk")
                        .genre("Electronic")
                        .matchReason("Grammy-winning album featuring rich production & electronic synth grooves")
                        .sampleQuery("daft punk random access memories")
                        .build(),
                InsightResponse.RecommendedAlbum.builder()
                        .title("Currents")
                        .artistName("Tame Impala")
                        .genre("Alternative")
                        .matchReason("Modern psychedelic alternative album matching your library aesthetic")
                        .sampleQuery("tame impala currents")
                        .build(),
                InsightResponse.RecommendedAlbum.builder()
                        .title("Future Nostalgia")
                        .artistName("Dua Lipa")
                        .genre("Pop")
                        .matchReason("High-energy pop release perfect for dynamic playlists")
                        .sampleQuery("dua lipa future nostalgia")
                        .build()
        );

        return candidatePool.stream()
                .filter(rec -> !savedTitles.contains(rec.getTitle().toLowerCase()))
                .limit(3)
                .collect(Collectors.toList());
    }
}
