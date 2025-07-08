const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const timeInput = document.getElementById('timeInput');
const bubbleBoard = document.getElementById('bubbleBoard');
const darkModeToggle = document.getElementById('darkModeToggle');

const motivationalQuotes = [
  "It always seems impossible until it's done.",
  "Nothing is impossible — the word itself says 'I'm possible'!",
  "Never give up, because great things take time.",
  "Push through — your future self will thank you.",
  "You're closer than you think — keep going!",
  "Even slow progress is still progress.",
  "Success doesn’t come overnight — but you're on your way."
];

// Show toast notification
function showToast(message) {
  const toastContainer = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}

// Save bubbles to localStorage
function saveBubbles() {
  const bubbles = [];
  document.querySelectorAll('.bubble').forEach(bubble => {
    const task = bubble.querySelector('strong').textContent;
    const time = bubble.dataset.timeLeft;
    if (time > 0) bubbles.push({ task, time });
  });
  localStorage.setItem('focusBubbles', JSON.stringify(bubbles));
}

// Create a new bubble
function createBubble(task, timeLeft, autoStart = true) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  bubble.dataset.timeLeft = timeLeft;

  const taskText = document.createElement('strong');
  taskText.textContent = task;

  const timeText = document.createElement('span');
  timeText.className = 'time';

  const pauseBtn = document.createElement('button');
  pauseBtn.textContent = 'Pause';

  let interval = null;
  let running = autoStart;

  const updateTimer = () => {
    let time = parseInt(bubble.dataset.timeLeft);
    const min = Math.floor(time / 60);
    const sec = time % 60;
    timeText.textContent = `${min}:${sec < 10 ? '0' : ''}${sec}`;

    if (time <= 0) {
      clearInterval(interval);
      bubble.classList.add('flash');

      setTimeout(() => {
        bubble.remove();

        const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
        showToast(`✅ Task completed! ${quote}`);

        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }

        saveBubbles();
      }, 1000);
      return;
    }

    bubble.dataset.timeLeft = time - 1;
    saveBubbles();
  };

  pauseBtn.addEventListener('click', () => {
    if (running) {
      clearInterval(interval);
      pauseBtn.textContent = 'Resume';
    } else {
      interval = setInterval(updateTimer, 1000);
      pauseBtn.textContent = 'Pause';
    }
    running = !running;
  });

  if (autoStart) interval = setInterval(updateTimer, 1000);
  updateTimer();

  bubble.appendChild(taskText);
  bubble.appendChild(timeText);
  bubble.appendChild(pauseBtn);
  bubbleBoard.appendChild(bubble);
}

// Load bubbles on page load
function loadBubbles() {
  const saved = JSON.parse(localStorage.getItem('focusBubbles')) || [];
  saved.forEach(b => createBubble(b.task, parseInt(b.time), false));
}

// Rotate quote box
function rotateQuotes() {
  const quoteBox = document.getElementById('quoteBox');
  const quoteText = document.getElementById('quoteText');
  const dismissBtn = document.getElementById('dismissBtn');

  let index = 0;
  quoteText.textContent = motivationalQuotes[index];

  const interval = setInterval(() => {
    index = (index + 1) % motivationalQuotes.length;
    quoteText.textContent = motivationalQuotes[index];
  }, 15000);

  dismissBtn.addEventListener('click', () => {
    quoteBox.style.display = 'none';
    clearInterval(interval);
  });
}

// Init
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const task = taskInput.value.trim();
  const minutes = parseInt(timeInput.value);
  if (task && minutes > 0) {
    createBubble(task, minutes * 60);
    taskInput.value = '';
    timeInput.value = '';
  }
});

darkModeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');
});

window.addEventListener('load', () => {
  loadBubbles();
  rotateQuotes();
});
