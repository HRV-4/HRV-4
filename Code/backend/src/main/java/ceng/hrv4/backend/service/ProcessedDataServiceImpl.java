package ceng.hrv4.backend.service;

import ceng.hrv4.backend.dto.request.ProcessedDataRequestDto;
import ceng.hrv4.backend.dto.response.ProcessedDataResponseDto;
import ceng.hrv4.backend.entity.ProcessedData;
import ceng.hrv4.backend.mapper.ProcessedDataMapper;
import ceng.hrv4.backend.repository.ProcessedDataRepository;
import ceng.hrv4.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of ProcessedDataService interface.
 * Provides CRUD operations and user-specific queries for ProcessedData entities.
 */
@Service
public class ProcessedDataServiceImpl implements ProcessedDataService {

    private final ProcessedDataRepository processedDataRepository;
    private final ProcessedDataMapper processedDataMapper;
    private final UserRepository userRepository;

    /**
     * Constructor injection for required dependencies.
     *
     * @param processedDataRepository repository for ProcessedData entity
     * @param processedDataMapper mapper for converting between DTO and entity
     * @param userRepository repository for User entity
     */
    public ProcessedDataServiceImpl(ProcessedDataRepository processedDataRepository, ProcessedDataMapper processedDataMapper, UserRepository userRepository) {
        this.processedDataRepository = processedDataRepository;
        this.processedDataMapper = processedDataMapper;
        this.userRepository = userRepository;
    }

    /**
     * Saves a new ProcessedData record into the database.
     *
     * @param dto request DTO containing processed measurement details
     * @return saved ProcessedData as a response DTO
     */
    @Override
    public ResponseEntity<ProcessedDataResponseDto> saveProcessedData(ProcessedDataRequestDto dto) {
        try {
            ProcessedData entity = processedDataMapper.toEntity(dto);
            ProcessedData saved = processedDataRepository.save(entity);
            return new ResponseEntity<>(processedDataMapper.toDto(saved), HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Finds a ProcessedData record by its measurement ID.
     *
     * @param MeasurementID unique identifier of the measurement
     * @return ProcessedDataResponseDto if found, otherwise throws exception
     */
    @Override
    public ResponseEntity<ProcessedDataResponseDto> findProcessedDataByMeasurementID(String MeasurementID) {
        try {
            ProcessedData entity = processedDataRepository.findById(MeasurementID).orElse(null);
            if (entity == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(processedDataMapper.toDto(entity), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves all ProcessedData records from the database.
     *
     * @return list of ProcessedDataResponseDto objects
     */
    @Override
    public ResponseEntity<List<ProcessedDataResponseDto>> findAllProcessedData() {
        try {
            List<ProcessedDataResponseDto> dtos = processedDataRepository.findAll()
                    .stream()
                    .map(processedDataMapper::toDto)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes a ProcessedData record by its measurement ID.
     *
     * @param MeasurementID unique identifier of the measurement to delete
     */
    @Override
    public ResponseEntity<String> deleteProcessedDataByMeasurementID(String MeasurementID) {
        try {
            if (!processedDataRepository.existsById(MeasurementID)) {
                return new ResponseEntity<>("Processed Data not found with id" + MeasurementID + ", cannot delete.", HttpStatus.NOT_FOUND);
            }

            processedDataRepository.deleteById(MeasurementID);
            return new ResponseEntity<>("Processed Data deleted successfully.", HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Cannot delete Processed Data", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Finds all ProcessedData records belonging to a specific user.
     *
     * @param UserId ID of the user whose processed measurements are requested
     * @return list of ProcessedDataResponseDto objects for that user
     */
    @Override
    public ResponseEntity<List<ProcessedDataResponseDto>> findProcessedDataByUserID(String UserId) {
        try {
            if (!userRepository.existsById(UserId)) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }

            List<ProcessedDataResponseDto> dtos = processedDataRepository.findByUserId(UserId)
                    .stream()
                    .map(processedDataMapper::toDto)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(dtos, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
