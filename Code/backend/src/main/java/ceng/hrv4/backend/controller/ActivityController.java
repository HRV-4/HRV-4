package ceng.hrv4.backend.controller;

import ceng.hrv4.backend.dto.request.ActivityRequestDto;
import ceng.hrv4.backend.dto.response.ActivityResponseDto;
import ceng.hrv4.backend.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
public class ActivityController {

    private final ActivityService activityService;

    @Autowired
    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    /**
     * POST /api/v1/activities
     */
    @PostMapping
    public ResponseEntity<ActivityResponseDto> createActivity(@RequestBody ActivityRequestDto activityRequestDto) {
        return activityService.saveActivity(activityRequestDto);
    }

    /**
     * GET /api/v1/activities
     */
    @GetMapping
    public ResponseEntity<List<ActivityResponseDto>> getAllActivities() {
        return activityService.findAllActivities();
    }

    /**
     * GET /api/v1/activities/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ActivityResponseDto> getActivityById(@PathVariable("id") String measurementId) {
        return activityService.findActivityByMeasurementID(measurementId);
    }

    /**
     * GET /api/v1/activities/by-category?category=exercise
     */
    @GetMapping("/by-category")
    public ResponseEntity<List<ActivityResponseDto>> getActivitiesByCategory(@RequestParam String category) {
        return activityService.findActivityByCategory(category);
    }

    /**
     * GET /api/v1/activities/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ActivityResponseDto>> getActivitiesByUser(@PathVariable("userId") String userId) {
        return activityService.findActivityByUserId(userId);
    }

    /**
     * DELETE /api/v1/activities/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteActivity(@PathVariable("id") String measurementId) {
        return activityService.deleteActivityByMeasurementID(measurementId);
    }
}