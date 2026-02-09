package ceng.hrv4.backend.service;

import ceng.hrv4.backend.dto.request.RawDataRequestDto;
import ceng.hrv4.backend.dto.response.RawDataResponseDto;
import ceng.hrv4.backend.entity.RawData;
import ceng.hrv4.backend.mapper.RawDataMapper;
import ceng.hrv4.backend.repository.RawDataRepository;
import ceng.hrv4.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of RawDataService interface.
 * Provides CRUD operations and user-specific queries for RawData entities.
 */
@Service
public class RawDataServiceImpl implements RawDataService {

    private final RawDataRepository rawDataRepository;
    private final RawDataMapper rawDataMapper;
    private final UserRepository userRepository;

    /**
     * Constructor injection for required dependencies.
     *
     * @param rawDataRepository repository for RawData entity
     * @param rawDataMapper mapper for converting between DTO and entity
     * @param userRepository repository for User entity
     */
    public RawDataServiceImpl(RawDataRepository rawDataRepository, RawDataMapper rawDataMapper, UserRepository userRepository) {
        this.rawDataRepository = rawDataRepository;
        this.rawDataMapper = rawDataMapper;
        this.userRepository = userRepository;
    }

    /**
     * Saves a new RawData record into the database.
     *
     * @param dto request DTO containing measurement details
     * @return saved RawData as a response DTO
     */
    @Override
    public ResponseEntity<RawDataResponseDto> saveRawData(RawDataRequestDto dto) {
        try {
            RawData entity = rawDataMapper.toEntity(dto);
            RawData saved = rawDataRepository.save(entity);
            return new ResponseEntity<>(rawDataMapper.toDto(saved), HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Finds a RawData record by its measurement ID.
     *
     * @param MeasurementID unique identifier of the measurement
     * @return RawDataResponseDto if found, otherwise throws exception
     */
    @Override
    public ResponseEntity<RawDataResponseDto> findRawDataByMeasurementID(String MeasurementID) {
        try {
            RawData entity = rawDataRepository.findById(MeasurementID).orElse(null);
            if (entity == null) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(rawDataMapper.toDto(entity), HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Retrieves all RawData records from the database.
     *
     * @return list of RawDataResponseDto objects
     */
    @Override
    public ResponseEntity<List<RawDataResponseDto>> findAllRawData() {
        try {
            List<RawDataResponseDto> dtos = rawDataRepository.findAll()
                    .stream()
                    .map(rawDataMapper::toDto)
                    .collect(Collectors.toList());
            return new ResponseEntity<>(dtos, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deletes a RawData record by its measurement ID.
     *
     * @param MeasurementID unique identifier of the measurement to delete
     */
    @Override
    public ResponseEntity<String> deleteRawDataByMeasurementID(String MeasurementID) {
        try {
            if (!rawDataRepository.existsById(MeasurementID)) {
                return new ResponseEntity<>("Raw Data not found with id" + MeasurementID + ", cannot delete.", HttpStatus.NOT_FOUND);
            }

            rawDataRepository.deleteById(MeasurementID);
            return new ResponseEntity<>("Raw Data deleted successfully.", HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>("Cannot delete Raw Data", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Finds all RawData records belonging to a specific user.
     *
     * @param UserId ID of the user whose measurements are requested
     * @return list of RawDataResponseDto objects for that user
     */
    @Override
    public ResponseEntity<List<RawDataResponseDto>> findRawDataByUserID(String UserId) {
        try {
            if (!userRepository.existsById(UserId)) {
                return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
            }

            List<RawDataResponseDto> dtos = rawDataRepository.findByUserId(UserId)
                    .stream()
                    .map(rawDataMapper::toDto)
                    .collect(Collectors.toList());

            return new ResponseEntity<>(dtos, HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
