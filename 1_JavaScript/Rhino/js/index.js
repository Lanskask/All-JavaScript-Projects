/*
 * Это JavaScript функция, которая заставляет пример работать.
 * Обратите внимание: в этом сценарии определяется функция calculate(),
 * вызываемая обработчиками событий в форме. Функция извлекает значения
 * из полей <input> формы, используя имена, определенные в коде, который
 * приведен ранее. Результаты выводятся в именованные элементы <span>
 */
function calculate() {
    // Получаем пользовательские данные из формы. Предполагаем, что данные
    // являются корректными. Преобразуем процентную ставку из процентов
    // в десятичное значение. Преобразуем период платежа
    // в годах в количество месячных платежей.
    var principal = document.loandata.principal.value;
    var interest = document.loandata.interest.value / 100 / 12;
    var payments = document.loandata.years.value * 12;

    // Теперь вычисляется сумма ежемесячного платежа.
    var x = Math.pow(1 + interest, payments);
    var monthly = (principal * x * interest) / (x-1);

    // Получить ссылки на именованные элементы <span> формы.
    var payment = document.getElementById("payment");
    var total = document.getElementById("total");
    var totalinterest = document.getElementById("totalinterest");

    // Убедиться, что результат является конечным числом. Если это так –
    // отобразить результаты, определив содержимое каждого элемента <span>.
    if (isFinite(monthly)) {
        payment.innerHTML = monthly.toFixed(2);
        total.innerHTML = (monthly * payments).toFixed(2);
        totalinterest.innerHTML = ((monthly * payments) - principal).toFixed(2);
    }
    
    // В противном случае данные, введенные пользователем, по видимому
    // были некорректны, поэтому ничего не выводится.
    else {
        payment.innerHTML = "";
        total.innerHTML = "";
        totalinterest.innerHTML = "";
    }
}
