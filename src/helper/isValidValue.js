export default function isValidValue(value) {
  return (
    value !== null && value !== undefined && value !== '' && value !== false
  );
}
