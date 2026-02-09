package ceng.hrv4.backend.repository;

import ceng.hrv4.backend.entity.ModelOutput;
import org.springframework.stereotype.Repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
@Repository
public interface ModelOutputRepository extends MongoRepository<ModelOutput, String> {
     List<ModelOutput> findByUserId(String userId);

}
