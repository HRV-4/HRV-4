package ceng.hrv4.backend.service;

import ceng.hrv4.backend.entity.ModelOutput;
import ceng.hrv4.backend.repository.ModelOutputRepository;
import ceng.hrv4.backend.mapper.ModelOutputMapper;
import ceng.hrv4.backend.dto.request.ModelOutputRequestDto;
import ceng.hrv4.backend.dto.response.ModelOutputResponseDto;
import ceng.hrv4.backend.repository.UserRepository; // We need this to link the user
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class ModelOutputServiceImpl implements ModelOutputService {

    // --- Dependencies ---
    // We need the repositories for ModelOutput (to save/find outputs)
    // and User (to link the output to a user).
    private final ModelOutputRepository modelOutputRepository;
    private final UserRepository userRepository;
    private final ModelOutputMapper modelOutputMapper;

    @Autowired
    public ModelOutputServiceImpl(ModelOutputRepository modelOutputRepository, UserRepository userRepository, ModelOutputMapper modelOutputMapper) {
        this.modelOutputRepository = modelOutputRepository;
        this.userRepository = userRepository;
        this.modelOutputMapper = modelOutputMapper;
    }

    /**
     * Gets all model outputs for a specific user.
     * @param userId The ID of the user.
     * @return A list of ModelOutput objects.
     * @throws RuntimeException if the user does not exist.
     */
    @Override
    public ResponseEntity<List<ModelOutputResponseDto>> getOutputsByUserId(String userId) {
         try {
             // Business Logic: Check if user exists first
             if (!userRepository.existsById(userId)) {
                 return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
             }

             List<ModelOutputResponseDto> dtos = modelOutputRepository.findByUserId(userId)
                     .stream()
                     .map(modelOutputMapper::toDto)
                     .toList();

             return new ResponseEntity<>(dtos, HttpStatus.OK);
         }
         catch (Exception e) {
             return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
         }

    }

    /**
     * Gets a single output by its measurement ID.
     * @param measurementId The ID (primary key) of the measurement.
     * @return The found ModelOutput.
     * @throws RuntimeException if the measurement is not found.
     */
    @Override
    public ResponseEntity<ModelOutputResponseDto> getOutputByMeasurementId(String measurementId) {
        try {
            // Use the built-in 'findById' method.
            ModelOutput output = modelOutputRepository.findById(measurementId).orElse(null);
            if (output == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }

            return new ResponseEntity<>(modelOutputMapper.toDto(output), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Gets all model outputs in the entire database.
     * (Useful for admin or debugging)
     * @return A list of all ModelOutput objects.
     */
    @Override
    public ResponseEntity<List<ModelOutputResponseDto>> findAllModelOutputs() {
        try {
            // Use the built-in 'findAll' method.
            List<ModelOutputResponseDto> dtos = modelOutputRepository.findAll()
                    .stream()
                    .map(modelOutputMapper::toDto)
                    .toList();

            return new ResponseEntity<>(dtos, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes a model output by its measurement ID.
     * @param measurementId The ID of the measurement to delete.
     * @throws RuntimeException if the measurement is not found.
     */
    @Override
    public ResponseEntity<String> deleteModelOutput(String measurementId) {
        try {
            // Business Logic: Check if it exists before trying to delete.
            if (!modelOutputRepository.existsById(measurementId)) {
                return new ResponseEntity<>("ModelOutput not found, cannot delete.", HttpStatus.NOT_FOUND);
            }

            // Use the built-in 'deleteById' method.
            modelOutputRepository.deleteById(measurementId);
            return new ResponseEntity<>("ModelOutput deleted successfully.", HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Cannot delete ModelOutput.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Creates and saves a new ModelOutput from a DTO.
     * @param requestDto The DTO containing the input data.
     * @return A ResponseEntity containing the saved DTO or an error message.
     */
    @Override
    public ResponseEntity<ModelOutputResponseDto> createModelOutput(ModelOutputRequestDto requestDto) {
         try {
             // 1. Business Logic: Validate that the user exists
             if (!userRepository.existsById(requestDto.userId())) {
                 // Return NOT_FOUND if the user doesn't exist
                 return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
             }

             // 2. Mapping Logic: Use the mapper to create the entity
             ModelOutput newOutput = modelOutputMapper.toEntity(requestDto);

             // 3. Save the new entity to the database
             ModelOutput savedOutput = modelOutputRepository.save(newOutput);

             // 4. Map the saved entity to a response DTO
             ModelOutputResponseDto responseDto = modelOutputMapper.toDto(savedOutput);

             // 5. Return the new DTO with a 201 CREATED status
             return new ResponseEntity<>(responseDto, HttpStatus.CREATED);
         }
         catch (Exception e) {
             return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
         }
    }
}