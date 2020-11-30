const REQUEST_TIMEOUT = 2000; // ms

const phonebookTable = document.getElementById('phonebook-table');
const phonebookTableBody = phonebookTable.getElementsByTagName('tbody')[0];
const loadingAlert = document.getElementById('loading-alert');

function loadPhonebook() {
  phonebookTable.classList.add('d-none');
  loadingAlert.classList.add('d-none');


  const abortController = new AbortController();
  const timer = setTimeout(() => {
    abortController.abort();
  }, REQUEST_TIMEOUT);

  fetch('/api/phonebook', { signal: abortController.signal })
    .then((response) => response.json())
    .then((json) => {
      phonebookTableBody.innerHTML = '';
      const phonebook = json.phonebook;
      phonebook.forEach((phone) => {
        const row = document.createElement('tr');
        const lastNameCol = document.createElement('td');
        lastNameCol.textContent = phone.lastName;
        row.appendChild(lastNameCol);
        const firstNameCol = document.createElement('td');
        firstNameCol.textContent = phone.title;
        row.appendChild(firstNameCol);
        const birthDateCol = document.createElement('td');
        birthDateCol.textContent = phone.birthDate;
        row.appendChild(birthDateCol);
        const phoneNumberCol = document.createElement('td');
        phoneNumberCol.textContent = phone.phoneNumber;
        row.appendChild(phoneNumberCol);
        const emailAddressCol = document.createElement('td');
        emailAddressCol.textContent = phone.emailAddress;
        row.appendChild(emailAddressCol);
        phonebookTableBody.appendChild(row);
      });
      phonebookTable.classList.remove('d-none');
    })
    .catch((error) => {
      loadingAlert.classList.remove('d-none');
      console.error(error);
    })
    .finally(() => {
      clearTimeout(timer);
    });
}

loadPhonebook();

const phonebookForm = document.getElementById('phonebook-form');
const lastNameInput = document.getElementById('lastNameInput');
const firstNameInput = document.getElementById('firstNameInput');
const birthDateInput = document.getElementById('birthDateInput');
const phoneNumberInput = document.getElementById('phoneNumberInput');
const emailAddressInput = document.getElementById('emailAddressInput');

const sendingFailure = document.getElementById('sending-failure');

function sendForm() {

  lastNameInput.setAttribute('disabled', true);
  firstNameInput.setAttribute('disabled', true);
  birthDateInput.setAttribute('disabled', true);
  phoneNumberInput.setAttribute('disabled', true);
  emailAddressInput.setAttribute('disabled', true);


  const data = {
    lastName: lastNameInput.value,
    firstName: firstNameInput.value,
    birthDate: birthDateInput.value,
    phoneNumber: phoneNumberInput.value,
    emailAddress: emailAddressInput.value,
  };

  const abortController = new AbortController();
  const timer = setTimeout(() => {
    abortController.abort();
  }, REQUEST_TIMEOUT);

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  fetch('/api/phonebook', {
    method: 'POST',
    body: JSON.stringify(data),
    headers,
    signal: abortController.signal,
  })
    .then((response) => {
      if (response.ok) {
        loadPhonebook();
        phonebookForm.reset();
        phonebookForm.classList.remove('was-validated');
        window.scrollTo(0, 0);
      }
    })
    .catch((error) => {
      sendingFailure.classList.remove('d-none');
    })
    .finally(() => {
      lastNameInput.removeAttribute('disabled');
      firstNameInput.removeAttribute('disabled');
      birthDateInput.removeAttribute('disabled');
      phoneNumberInput.removeAttribute('disabled');
      emailAddressInput.removeAttribute('disabled');
      clearTimeout(timer);
    });
}

phonebookForm.addEventListener('submit', (event) => {
  sendingFailure.classList.add('d-none');
  event.preventDefault();
  event.stopPropagation();
  if (phonebookForm.checkValidity()) {
    sendForm();
  }

  phonebookForm.classList.add('was-validated');
});

const refreshButton = document.getElementById('refresh-button');

refreshButton.addEventListener('click', (event) => {
  loadPhonebook();
});
