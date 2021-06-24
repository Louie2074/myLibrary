let myLibrary =
  localStorage['myLibrary'] !== undefined
    ? [...JSON.parse(localStorage['myLibrary'])]
    : [];
const table = document.querySelector('.table');
const add = document.querySelector('.addBook');
const modalClose = document.querySelector('.close');
const inputs = document.querySelectorAll('input');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const submit = document.querySelector('.submit');
const msg = document.querySelector('.msg');

class Book {
  constructor(title, author, numPage, beenRead) {
    this.title = title;
    this.author = author;
    this.numPage = numPage;
    this.beenRead = beenRead;
  }
  addToLibrary() {
    myLibrary.push(this);
    table.appendChild(this.toCard());

    const newStorage = [...JSON.parse(localStorage.getItem('myLibrary'))];
    newStorage.push(this);
    localStorage['myLibrary'] = JSON.stringify(newStorage);
  }
  removeFromLibrary(card) {
    const index = myLibrary.indexOf(this);
    const newStorage = [...JSON.parse(localStorage.getItem('myLibrary'))];
    table.removeChild(card);
    if (index > -1) {
      myLibrary.splice(index, 1);
      newStorage.splice(index, 1);
    }
    localStorage['myLibrary'] = JSON.stringify(myLibrary);
  }

  toCard() {
    let card = document.createElement('div');
    card.classList.toggle('card');
    let remove = document.createElement('button');
    remove.addEventListener('click', () => {
      myLibrary[myLibrary.indexOf(this)].removeFromLibrary(card);
    });
    remove.textContent = 'Remove';
    remove.classList.add('remove');
    let read = document.createElement('button');
    read.textContent = 'Read';
    read.classList.add('read');
    if (this.beenRead) {
      read.style.backgroundColor = 'green';
    } else {
      read.style.backgroundColor = 'red';
    }
    read.addEventListener('click', () => {
      if (this.beenRead) {
        this.beenRead = false;
        read.style.backgroundColor = 'red';
      } else {
        this.beenRead = true;
        read.style.backgroundColor = 'green';
      }
    });
    card.textContent = `${this.title}\n`;
    card.textContent += `Author: ${this.author}\n`;
    card.textContent += `${this.numPage} pages\n`;
    if (this.beenRead) read.classList.add('.read');
    else read.classList.add('.notRead');
    card.book = this;
    card.appendChild(read);
    card.appendChild(remove);
    return card;
  }
}

let initialized = myLibrary.map((object) => {
  const toAdd = new Book(
    object.title,
    object.author,
    object.numPage,
    object.beenRead
  );

  table.appendChild(toAdd.toCard());
  return (object = toAdd);
});

myLibrary = initialized;

add.addEventListener('click', () => {
  openModal();
});

overlay.addEventListener('click', () => {
  closeModal();
});

modalClose.addEventListener('click', () => {
  closeModal();
  let x = [...inputs];

  x.forEach((input) => {
    if (input.type === 'checkbox') input.checked = false;
    else input.value = '';
  });
});


submit.addEventListener('click', () => {
  let x = [...inputs];
  let check = x.every((input) => {
    return input.value !== '';
  });

  if (check) {
    closeModal();
    let toAdd = new Book(
      inputs[0].value,
      inputs[1].value,
      inputs[2].value,
      inputs[3].checked
    );
    toAdd.addToLibrary();

    x.forEach((input) => {
      if (input.type === 'checkbox') input.checked = false;
      else input.value = '';
    });
    msg.textContent = '';
  } else {
    msg.textContent = 'Please fill out ALL of the Required Fields';
    return;
  }
});

function closeModal() {
  overlay.classList.remove('overlay-active');
  modal.classList.remove('modal-active');
}

function openModal() {
  overlay.classList.add('overlay-active');
  modal.classList.add('modal-active');
}
