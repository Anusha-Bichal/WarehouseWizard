namespace Backend.Common
{
    public class ServiceResponse<T>
    {
        public T Data { get; set; } = default(T);
        public bool Success { get; set; } = true;
        public string Message { get; set; } = string.Empty;

        public ServiceResponse(T data, bool success = true, string message = "")
        {
            Data = data;
            Success = success;
            Message = message;
        }

        public bool IsSuccess()
        {
            return Success;
        }
    }
}
