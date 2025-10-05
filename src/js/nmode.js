// Ночной режим
const btnnmode = document.querySelector('#nmode');
const body = document.body;
const title = document.querySelector('.header__title');
const input = document.querySelector('.habit-input');
const addHabitBtn = document.querySelector('.add-btn');
const habitList = document.querySelector('.habit-list');
const habitItem = document.querySelector('.habit-item');

btnnmode.addEventListener('click', () => {
  body.classList.toggle('dark-theme'); // переключаем класс

// Переключаем класс активности
  togglenmode();
});

// Функция включения ночного режима
function togglenmode() {
    btnnmode.classList.toggle('btnnight-mode-active');
}