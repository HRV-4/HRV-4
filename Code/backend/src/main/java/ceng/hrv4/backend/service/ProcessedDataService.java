package ceng.hrv4.backend.service;

import ceng.hrv4.backend.dto.request.ProcessedDataRequestDto;
import ceng.hrv4.backend.dto.response.ProcessedDataResponseDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * Service interface for managing ProcessedData entities.
 * Defines the contract for CRUD operations and custom queries.
 */
public interface ProcessedDataService {

    /**
     * Saves a new ProcessedData record into the database.
     *
     * @param dto the request DTO containing processed measurement details
     * @return the saved ProcessedData as a response DTO
     */
    ResponseEntity<ProcessedDataResponseDto> saveProcessedData(ProcessedDataRequestDto dto);

    /**
     * Finds a ProcessedData record by its measurement ID.
     *
     * @param MeasurementID the unique identifier of the measurement
     * @return the ProcessedDataResponseDto if found, otherwise throws an exception
     */
    ResponseEntity<ProcessedDataResponseDto> findProcessedDataByMeasurementID(String MeasurementID);

    /**
     * Retrieves all ProcessedData records from the database.
     *
     * @return a list of ProcessedDataResponseDto objects
     */
    ResponseEntity<List<ProcessedDataResponseDto>> findAllProcessedData();

    /**
     * Deletes a ProcessedData record by its measurement ID.
     *
     * @param MeasurementID the unique identifier of the measurement to delete
     */
    ResponseEntity<String> deleteProcessedDataByMeasurementID(String MeasurementID);

    /**
     * Finds all ProcessedData records belonging to a specific user.
     *
     * @param UserId the ID of the user whose processed measurements are requested
     * @return a list of ProcessedDataResponseDto objects for that user
     */
    ResponseEntity<List<ProcessedDataResponseDto>> findProcessedDataByUserID(String UserId);
}
