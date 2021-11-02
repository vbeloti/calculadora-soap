const visor = document.getElementById('visor');
let calculatorFirst = document.getElementById('calculator__first');
let calculatorOperation = document.getElementById('calculator__operation');
let calculatorSecond = document.getElementById('calculator__second');

let firstNumbers = '';
let secondNumbers = '';
let operation = '';
let result = '';

function getOperation(operationElement) {
  if (!firstNumbers) return;
  if (secondNumbers) return;

  operation = operationElement.value;

  visor.value = firstNumbers + operation;
}

function getNumber(number) {
  if (result) {
    clearInputs();
    result = '';
  }

  if (operation) {
    secondNumbers += number;
  } else {
    if (number === '0' && firstNumbers.length === 0) return;
    firstNumbers += number;
  }

  if (visor.value === "0") {
    return visor.value = number;
  }

  if (secondNumbers.length === 2 && secondNumbers[0] === '0') {
    secondNumbers = secondNumbers.slice(1);
    return visor.value = firstNumbers + operation + secondNumbers.slice(1) + number;
  }

  visor.value += number;
}

function clearInputs() {
  firstNumbers = '';
  secondNumbers = '';
  operation = '';
  calculatorFirst.innerHTML = '';
  calculatorOperation.innerHTML = '';
  calculatorSecond.innerHTML = '';
  visor.value = '0';

  if (visor.classList.contains('text__not_possible')) {
    visor.classList.remove('text__not_possible');
  }
}

function calculate() {
  if (!firstNumbers || !secondNumbers || !operation) return;

  const operationObj = {
    'x': 'Multiply',
    '+': 'Add',
    '-': 'Subtract',
    '/': 'Divide'
  };

  const data = `<\?xml version="1.0" encoding="utf-8"?> <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
                        <soapenv:Body>
                          <tns:${operationObj[operation]} xmlns:tns="http://tempuri.org/">
                          <tns:intA>${firstNumbers}</tns:intA>
                          <tns:intB>${secondNumbers}</tns:intB>
                          </tns:${operationObj[operation]}>
                        </soapenv:Body>
                      </soapenv:Envelope>`;

  const byPassCors = 'https://cors.devgang.site/';
  const url = `${byPassCors}http://www.dneonline.com/calculator.asmx?wsdl`;

  if (operation === '/' && secondNumbers === '0') {
    visor.classList.add('text__not_possible');
    return visor.value = 'Não é possível dividir por 0';
  }

  fetch(url, {
    body: data,
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml'
    },
  })
    .then(response => response.text())
    .then(xml => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      result = xmlDoc.getElementsByTagName(`${operationObj[operation]}Result`)[0].textContent;
      calculatorFirst.innerHTML = firstNumbers;
      calculatorOperation.innerHTML = operation;
      calculatorSecond.innerHTML = secondNumbers;
      visor.value = result;
    })
    .catch(function (error) {
      console.log(error);
    });
}
