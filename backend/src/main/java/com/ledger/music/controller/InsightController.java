package com.ledger.music.controller;

import com.ledger.music.dto.InsightResponse;
import com.ledger.music.service.InsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/api/insights", "/api/ai"})
@RequiredArgsConstructor
public class InsightController {

    private final InsightService insightService;

    @GetMapping("/insights")
    public ResponseEntity<InsightResponse> getLibraryInsights(@AuthenticationPrincipal UserDetails userDetails) {
        InsightResponse insights = insightService.generateLibraryInsights(userDetails.getUsername());
        return ResponseEntity.ok(insights);
    }
}
