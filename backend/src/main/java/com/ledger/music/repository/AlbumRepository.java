package com.ledger.music.repository;

import com.ledger.music.domain.Album;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {

    List<Album> findByUserId(Long userId);

    Page<Album> findByUserId(Long userId, Pageable pageable);

    Optional<Album> findByUserIdAndId(Long userId, Long id);

    Optional<Album> findByUserIdAndAppleCatalogId(Long userId, Long appleCatalogId);

    boolean existsByUserIdAndAppleCatalogId(Long userId, Long appleCatalogId);

    @Query("SELECT a.genre, COUNT(a) FROM Album a WHERE a.userId = :userId GROUP BY a.genre ORDER BY COUNT(a) DESC")
    List<Object[]> countAlbumsByGenre(Long userId);

    @Query("SELECT a.artistName, COUNT(a) FROM Album a WHERE a.userId = :userId GROUP BY a.artistName ORDER BY COUNT(a) DESC")
    List<Object[]> countAlbumsByArtist(Long userId);
}
