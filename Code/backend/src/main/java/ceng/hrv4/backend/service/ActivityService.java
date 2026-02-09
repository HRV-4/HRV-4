package ceng.hrv4.backend.service;

import ceng.hrv4.backend.dto.request.ActivityRequestDto;
import ceng.hrv4.backend.dto.response.ActivityResponseDto;

import java.util.List;

import org.springframework.http.ResponseEntity;

/**
 * Service interface for managing Activity entities.
 * Defines the contract for CRUD operations and custom queries.
 */
public interface ActivityService {

    /**
     * Saves a new Activity record into the database.
     *
     * @param dto the request DTO containing activity details
     * @return the saved Activity as a response DTO
     */
    ResponseEntity<ActivityResponseDto> saveActivity(ActivityRequestDto dto);

    /**
     * Finds an Activity record by its ID.
     *
     * @param MeasurementID the unique identifier of the activity
     * @return the ActivityResponseDto if found, otherwise throws an exception
     */
    ResponseEntity<ActivityResponseDto> findActivityByMeasurementID(String MeasurementID);

    /**
     * Finds an Activity record by its ActivityName.
     *
     * @param ActivityName the ActivityName of the activity
     * @return the ActivityResponseDto if found, otherwise throws an exception
     */
    ResponseEntity<ActivityResponseDto> findActivityByName(String ActivityName);

    /**
     * Retrieves all Activity records from the database.
     *
     * @return a list of ActivityResponseDto objects
     */
    ResponseEntity<List<ActivityResponseDto>> findAllActivities();

    /**
     * Deletes an Activity record by its ID.
     *
     * @param MeasurementID the unique identifier of the activity to delete
     * @return
     */
    ResponseEntity<String> deleteActivityByMeasurementID(String MeasurementID);
}


