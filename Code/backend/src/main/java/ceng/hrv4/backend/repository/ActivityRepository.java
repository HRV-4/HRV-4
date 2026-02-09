package ceng.hrv4.backend.repository;

import ceng.hrv4.backend.entity.Activity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ActivityRepository extends MongoRepository<Activity, String> {

    Optional<Activity> findByName(String name);

    boolean existsByName(String name);
}