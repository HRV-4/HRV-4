package ceng.hrv4.backend.service;

import ceng.hrv4.backend.dto.request.RawDataRequestDto;
import ceng.hrv4.backend.dto.response.RawDataResponseDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * Service interface for managing RawData entities.
 * Defines the contract for CRUD operations and custom queries.
 */
public interface RawDataService {

    /**
     * Saves a new RawData record into the database.
     *
     * @param dto the request DTO containing measurement details
     * @return the saved RawData as a response DTO
     */
    ResponseEntity<RawDataResponseDto> saveRawData(RawDataRequestDto dto);

    /**
     * Finds a RawData record by its measurement ID.
     *
     * @param MeasurementID the unique identifier of the measurement
     * @return the RawDataResponseDto if found, otherwise throws an exception
     */
    ResponseEntity<RawDataResponseDto> findRawDataByMeasurementID(String MeasurementID);

    /**
     * Retrieves all RawData records from the database.
     *
     * @return a list of RawDataResponseDto objects
     */
    ResponseEntity<List<RawDataResponseDto>> findAllRawData();

    /**
     * Deletes a RawData record by its measurement ID.
     *
     * @param MeasurementID the unique identifier of the measurement to delete
     */
    ResponseEntity<String> deleteRawDataByMeasurementID(String MeasurementID);

    /**
     * Finds all RawData records belonging to a specific user.
     *
     * @param UserId the ID of the user whose measurements are requested
     * @return a list of RawDataResponseDto objects for that user
     */
    ResponseEntity<List<RawDataResponseDto>> findRawDataByUserID(String UserId);
}
