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

/**
 * Implementation of ActivityService interface.
 * Provides CRUD operations and queries for Activity entities.
 */
@Slf4j
@Service
public class ActivityServiceImpl implements ActivityService {

    private final ActivityRepository activityRepository;
    private final ActivityMapper activityMapper;

    /**
     * Constructor injection for required dependencies.
     *
     * @param activityRepository repository for Activity entity
     * @param activityMapper mapper for converting between DTO and entity
     */
    public ActivityServiceImpl(ActivityRepository activityRepository, ActivityMapper activityMapper) {
        this.activityRepository = activityRepository;
        this.activityMapper = activityMapper;
    }

    /**
     * Saves a new Activity record into the database.
     *
     * @param dto request DTO containing activity details
     * @return saved Activity as a response DTO
     */
    @Override
    public ResponseEntity<ActivityResponseDto> saveActivity(ActivityRequestDto dto) {
        try {
            Activity entity = activityMapper.toEntity(dto);
            Activity saved = activityRepository.save(entity);
            return new ResponseEntity<>(activityMapper.toDto(saved), HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Finds an Activity record by its ID.
     *
     * @param MeasurementID unique identifier of the activity
     * @return ActivityResponseDto if found, otherwise throws exception
     */
    @Override
    public ResponseEntity<ActivityResponseDto> findActivityByMeasurementID(String MeasurementID) {
        try {
            Activity entity = activityRepository.findById(MeasurementID).orElse(null);
            if (entity == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(activityMapper.toDto(entity), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Finds an Activity record by its name.
     *
     * @param ActivityName name of the activity
     * @return ActivityResponseDto if found, otherwise throws exception
     */
    @Override
    public ResponseEntity<ActivityResponseDto> findActivityByName(String ActivityName) {
        try {
            Activity entity = activityRepository.findByName(ActivityName).orElse(null);
            if (entity == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(activityMapper.toDto(entity), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves all Activity records from the database.
     *
     * @return list of ActivityResponseDto objects
     */
    @Override
    public ResponseEntity<List<ActivityResponseDto>> findAllActivities() {
        try {
            List<ActivityResponseDto> dtos = activityRepository.findAll()
                    .stream()
                    .map(activityMapper::toDto)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes an Activity record by its ID.
     *
     * @param MeasurementID unique identifier of the activity to delete
     */
    @Override
    public ResponseEntity<String> deleteActivityByMeasurementID(String MeasurementID) {
        try {
            if (!activityRepository.existsById(MeasurementID)) {
                return new ResponseEntity<>("Activity not found.", HttpStatus.NOT_FOUND);
            }
            activityRepository.deleteById(MeasurementID);
            return new ResponseEntity<>("Activity deleted successfully.", HttpStatus.OK);
        }
        catch (Exception e) {
            log.error(e.getMessage());
            return new ResponseEntity<>("Cannot delete Activity.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
