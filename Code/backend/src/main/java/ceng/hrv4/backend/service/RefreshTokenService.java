package ceng.hrv4.backend.service;

import java.util.Date;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import ceng.hrv4.backend.entity.RefreshToken;
import ceng.hrv4.backend.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {

    @Value ("${jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    private final RefreshTokenRepository repo;

    public RefreshTokenService (RefreshTokenRepository repo) {
        this.repo = repo;
    }

    public String createRefreshToken(String username) {
        RefreshToken token = new RefreshToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUsername(username);
        token.setExpiryDate(new Date(System.currentTimeMillis() + refreshExpirationMs));

        repo.save(token);
        return token.getToken();
    }

    public RefreshToken verify(String token) {
        RefreshToken rt = repo.findByToken(token)
                .orElseThrow();

        if (rt.isRevoked() || rt.getExpiryDate().before(new Date()))
            throw new RuntimeException("Invalid refresh token");

        return rt;
    }

    public String rotate(RefreshToken oldToken) {
        oldToken.setRevoked(true);

        String newToken = UUID.randomUUID().toString();
        oldToken.setReplacedByToken(newToken);
        repo.save(oldToken);

        RefreshToken fresh = new RefreshToken();
        fresh.setToken(newToken);
        fresh.setUsername(oldToken.getUsername());
        fresh.setExpiryDate(new Date(System.currentTimeMillis() + refreshExpirationMs));

        repo.save(fresh);
        return newToken;
    }

    public void revoke(String token) {
        repo.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            repo.save(rt);
        });
    }
}
