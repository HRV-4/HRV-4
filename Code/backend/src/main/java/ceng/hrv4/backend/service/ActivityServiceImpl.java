package ceng.hrv4.backend.service;

import ceng.hrv4.backend.dto.request.ActivityRequestDto;
import ceng.hrv4.backend.dto.response.ActivityResponseDto;
import ceng.hrv4.backend.entity.Activity;
import ceng.hrv4.backend.mapper.ActivityMapper;
import ceng.hrv4.backend.repository.ActivityRepository;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;
    private final ActivityMapper activityMapper;

    public ActivityServiceImpl(ActivityRepository activityRepository, ActivityMapper activityMapper) {
        this.activityRepository = activityRepository;
        this.activityMapper = activityMapper;
    }

    @Override
    public ResponseEntity<ActivityResponseDto> saveActivity(ActivityRequestDto dto) {
        try {
            Activity entity = activityMapper.toEntity(dto);
            Activity saved = activityRepository.save(entity);
            return new ResponseEntity<>(activityMapper.toDto(saved), HttpStatus.CREATED);
        } catch (Exception e) {
            log.error("Error saving activity: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<ActivityResponseDto> findActivityByMeasurementID(String MeasurementID) {
        try {
            Activity entity = activityRepository.findById(MeasurementID).orElse(null);
            if (entity == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(activityMapper.toDto(entity), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Finds Activity records by their category.
     * Returns a list since multiple activities can share the same category.
     */
    @Override
    public ResponseEntity<List<ActivityResponseDto>> findActivityByCategory(String category) {
        try {
            List<Activity> entities = activityRepository.findByCategory(category);

            if (entities.isEmpty()) {
                return new ResponseEntity<>(List.of(), HttpStatus.OK);
            }

            List<ActivityResponseDto> dtos = entities.stream()
                    .map(activityMapper::toDto)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(dtos, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error finding activities by category: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Finds Activity records by user ID.
     */
    @Override
    public ResponseEntity<List<ActivityResponseDto>> findActivityByUserId(String userId) {
        try {
            List<Activity> entities = activityRepository.findByUserId(userId);

            List<ActivityResponseDto> dtos = entities.stream()
                    .map(activityMapper::toDto)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(dtos, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error finding activities by userId: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<List<ActivityResponseDto>> findAllActivities() {
        try {
            List<ActivityResponseDto> dtos = activityRepository.findAll()
                    .stream()
                    .map(activityMapper::toDto)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> deleteActivityByMeasurementID(String MeasurementID) {
        try {
            if (!activityRepository.existsById(MeasurementID)) {
                return new ResponseEntity<>("Activity not found.", HttpStatus.NOT_FOUND);
            }
            activityRepository.deleteById(MeasurementID);
            return new ResponseEntity<>("Activity deleted successfully.", HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error deleting activity: {}", e.getMessage());
            return new ResponseEntity<>("Cannot delete Activity.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}