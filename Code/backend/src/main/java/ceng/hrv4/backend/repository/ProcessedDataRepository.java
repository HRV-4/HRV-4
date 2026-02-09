package ceng.hrv4.backend.repository;

import ceng.hrv4.backend.entity.ProcessedData;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProcessedDataRepository extends MongoRepository<ProcessedData, String> {
    List<ProcessedData> findByUserId(String userId);

}
