package ceng.hrv4.backend.service;

import ceng.hrv4.backend.dto.request.ModelOutputRequestDto;
import ceng.hrv4.backend.dto.response.ModelOutputResponseDto;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ModelOutputService {

    /**
     * Gets all model outputs for a specific user.
     * @param userId The ID of the user.
     * @return A list of ModelOutput objects.
     * @throws RuntimeException if the user does not exist.
     */
    public ResponseEntity<List<ModelOutputResponseDto>> getOutputsByUserId(String userId);


    /**
     * Gets a single output by its measurement ID.
     * @param measurementId The ID (primary key) of the measurement.
     * @return The found ModelOutput.
     * @throws RuntimeException if the measurement is not found.
     */
    public ResponseEntity<ModelOutputResponseDto> getOutputByMeasurementId(String measurementId);


    /**
     * Gets all model outputs in the entire database.
     * (Useful for admin or debugging)
     * @return A list of all ModelOutput objects.
     */
    public ResponseEntity<List<ModelOutputResponseDto>> findAllModelOutputs();

    /**
     * Deletes a model output by its measurement ID.
     * @param measurementId The ID of the measurement to delete.
     * @throws RuntimeException if the measurement is not found.
     */
    public ResponseEntity<String> deleteModelOutput(String measurementId);


    /**
     * Creates and saves a new ModelOutput from a DTO.
     * @param requestDto The DTO containing the input data.
     * @return A ResponseEntity containing the saved DTO or an error message.
     */
    public ResponseEntity<ModelOutputResponseDto> createModelOutput(ModelOutputRequestDto requestDto);

}