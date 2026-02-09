package ceng.hrv4.backend.repository;

import ceng.hrv4.backend.entity.RawData;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;
import java.util.List;
@Repository
public interface RawDataRepository extends MongoRepository<RawData, String> {
    List<RawData> findByUserId(String userId);


}
