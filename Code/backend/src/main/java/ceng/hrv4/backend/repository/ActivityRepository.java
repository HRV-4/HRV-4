package ceng.hrv4.backend.repository;

import ceng.hrv4.backend.entity.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {

    List<Activity> findByCategory(String category);

    boolean existsByCategory(String category);

    List<Activity> findByUserId(String userId);
}