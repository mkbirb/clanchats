// Scroll to specific Message

export const jumpToMessage = (messageID) => {
  const element = document.getElementById(`message-${messageID}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    element.classList.add('bg-yellow-200', 'transition-colors', 'duration-2000');

    setTimeout(() => {
      element.classList.remove('bg-yellow-200');
    }, 2000);
  }
};