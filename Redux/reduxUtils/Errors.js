export default function errorCodes(error) {
  switch (error) {
    case 'Network Error':
      return {
        status: 'INTERNET_ERROR',
        message: 'Please check your internet connection',
      };
    default:
      return error;
  }
}
