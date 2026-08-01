package com.ledger.music.controller;

import com.ledger.music.dto.ItunesSearchResponse;
import com.ledger.music.service.ItunesProxyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final ItunesProxyService itunesProxyService;

    @GetMapping
    public ResponseEntity<ItunesSearchResponse> searchCatalog(
            @RequestParam(name = "query") String query,
            @RequestParam(name = "type", defaultValue = "album") String type,
            @RequestParam(name = "limit", defaultValue = "25") int limit) {
        
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        ItunesSearchResponse response = itunesProxyService.searchCatalog(query, type, limit);
        return ResponseEntity.ok(response);
    }
}
