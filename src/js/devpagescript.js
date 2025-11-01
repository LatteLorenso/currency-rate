// id="btn-300rub"
// id="btn-800rub"
// id="btn-1200rub"
// id="btn-2400rub"

const tarifBtns = document.querySelectorAll('.btn-tariff');

const inputemail = document.getElementById('input-email');
const btnsubmit = document.getElementById('btn-submit');

let emailCheck = false;
let tarifCheck = false;
let selectedTarif = "";

tarifBtns.forEach(btn => {
    btn.addEventListener("click", () => {
    // при нажатии на любую кнопку
    tarifCheck = true;

    // снять активный класс со всех
    tarifBtns.forEach(b => b.classList.remove("active"));

    // добавить активный класс только для нажатой
    btn.classList.add("active");

    // сохранить выбранный тариф
    selectedTarif = btn.textContent.split('-')[1].trim();

    checkButton();
});
});

inputemail.addEventListener("input", () => {
  if (inputemail.value.includes("@")) {
    emailCheck = true;
  } else {
    emailCheck = false;
  }

  checkButton();
});

function checkButton() {
    if (emailCheck && tarifCheck) {
        btnsubmit.classList.add("active");
        btnsubmit.textContent = `Оформить подписку - ${selectedTarif}`;
    } else if (!emailCheck) {
        btnsubmit.textContent = "Введите корректный email";
        btnsubmit.classList.remove("active");
    } else if (!tarifCheck) {
        btnsubmit.classList.remove("active");
    }
}


// btn300.addEventListener("click", () => {
//     btn300.classList.add("active");

//     if (!inputemail.value) {
//         btnsubmit.textContent = "Введите корректный email";
//         btnsubmit.classList.remove("active");
//     } else if (inputemail.value.includes("@")) {
//             btnsubmit.textContent = `Оформить подписку - ${"300 руб"}`;
//             btnsubmit.classList.add("active");
//         }
//     })
    
        
    // else if (inputemail.value.includes("@")) {
    //     btnsubmit.textContent = `Оформить подписку - ${"300 руб"}`;
    //     btnsubmit.classList.add("active");
    // } else {
    //     btnsubmit.textContent = "Введите корректный email";
    // }

// Закончил здеся 
