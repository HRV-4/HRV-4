package ceng.hrv4.backend.dto.response;



public record BaseResponseDto<T>(
        boolean success,
        String message,
        int code,
        T data
) {

    public static <T> BaseResponseDto<T> success(T data) {
        return new BaseResponseDto<>(true, "OK", 200, data);
    }

    public static <T> BaseResponseDto<T> error(String message, int code) {
        return new BaseResponseDto<>(false, message, code, null);
    }
}
