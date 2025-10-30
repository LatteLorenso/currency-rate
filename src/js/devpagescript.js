// id="btn-300rub"
// id="btn-800rub"
// id="btn-1200rub"
// id="btn-2400rub"

const btn300 = document.getElementById('btn-300rub');
const btn800 = document.getElementById('btn-800rub');
const btn1200 = document.getElementById('btn-1200rub');
const btn2400 = document.getElementById('btn-2400rub');

const inputemail = document.getElementById('input-email');
const btnsubmit = document.getElementById('btn-submit');

btn300.addEventListener("click", () => {
    btn300.classList.add("active");

    if (!inputemail.value) {
        btnsubmit.textContent = "Введите корректный email";
        btnsubmit.classList.remove("active");
    } else if (inputemail.value.includes("@")) {
        btnsubmit.textContent = `Оформить подписку - ${"300 руб"}`;
        btnsubmit.classList.add("active");
    } else {
        btnsubmit.textContent = "Введите корректный email";
    }

    }
)