package com.ledger.music.service;

import com.ledger.music.dto.ItunesSearchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

@Service
@RequiredArgsConstructor
public class ItunesProxyService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String ITUNES_BASE_URL = "https://itunes.apple.com/search";

    @Cacheable(value = "itunesSearch", key = "#term + '_' + #entity + '_' + #limit")
    public ItunesSearchResponse searchCatalog(String term, String entity, int limit) {
        String url = UriComponentsBuilder.fromHttpUrl(ITUNES_BASE_URL)
                .queryParam("term", term)
                .queryParam("entity", entity != null ? entity : "album")
                .queryParam("limit", limit > 0 ? limit : 25)
                .build()
                .toUriString();

        try {
            ItunesSearchResponse response = restTemplate.getForObject(url, ItunesSearchResponse.class);
            if (response != null) {
                response.setCached(false); // Indicates fresh fetch
            }
            return response;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to fetch catalog data from iTunes API: " + ex.getMessage(), ex);
        }
    }
}
