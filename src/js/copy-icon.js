document.getElementById('copy-icon-eth').addEventListener('click', function () {
    const text = document.getElementById('eth-value').value;

    navigator.clipboard.writeText(text)
        .then(() => {
            alert('Скопировано в буфер обмена!');
        })
        .catch(err => {
            alert('Ошибка копирования: ', err);
        });
});

document.getElementById('copy-icon-USDT').addEventListener('click', function () {
    const text = document.getElementById('USDT-value').value;

    navigator.clipboard.writeText(text)
    .then(() => {
        alert('Скопировано в буфер обмена!');
    })
    .catch(err => {
        alert('Ошибка копирования: ', err);
    });
});