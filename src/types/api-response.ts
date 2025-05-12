export default interface ApiResponse<T> {
  data?: T;
  error?: string;
}
