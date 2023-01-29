export default function handleElevator() {
  const elevatorEl = document.querySelector('.elevator');
  const bodyEl = document.querySelector('body');
  const bodyHeight = Math.floor(bodyEl.getBoundingClientRect().height);

  if (
    bodyHeight > screen.height &&
    elevatorEl.classList.contains('visually-hidden')
  ) {
    elevatorEl.classList.remove('visually-hidden');
  }
  if (
    bodyHeight <= screen.height &&
    !elevatorEl.classList.contains('visually-hidden')
  ) {
    elevatorEl.classList.add('visually-hidden');
  }
}
