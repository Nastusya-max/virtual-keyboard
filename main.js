let leng;
const keyLayoutEn = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace', leng, 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter', 'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '?', 'space'];
const keyLayoutRu = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace', leng, 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter', 'done', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ',', '.', '?', 'space'];
let keyLayout = keyLayoutEn;
class Keyboard {
  constructor() {
    this.elements = {
      main: null,
      keysContainer: null,
      keys: [],
    };
    this.eventHandlers = {
      oninput: null,
      onclose: null,
    };
    this.properties = {
      value: '',
      capsLock: false,
    };
  }

  init() {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    // Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.appendChild(this.createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    // Add to DOM
    this.elements.main.appendChild(this.elements.keysContainer);
    document.body.appendChild(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('focus', () => {
        const focusElement = element;
        this.open(focusElement.value, (currentValue) => {
          focusElement.value = currentValue;
          document.querySelector('.use-keyboard-input').focus();
        });
      });
    });
  }

  createKeys() {
    const fragment = document.createDocumentFragment();

    keyLayout.forEach((key) => {
      const keyElement = document.createElement('button');
      const insertLineBreak = ['backspace', 'p', 'enter', '?'].indexOf(key) !== -1;

      // Add attributes/classes
      keyElement.setAttribute('type', 'button');
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.properties.value = this.properties.value.substring(
              0,
              this.properties.value.length - 1,
            );
            this.triggerEvent('oninput');
          });

          break;

        case 'caps':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--activatable',
          );
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.toggleCapsLock();
            keyElement.classList.toggle(
              'keyboard__key--active',
              this.properties.capsLock,
            );
          });
          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.properties.value += '\n';
            this.triggerEvent('oninput');
          });

          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');

          keyElement.addEventListener('click', () => {
            this.properties.value += ' ';
            this.triggerEvent('oninput');
          });

          break;

        case 'done':
          keyElement.classList.add(
            'keyboard__key--wide',
            'keyboard__key--dark',
          );

          keyElement.textContent = key;

          keyElement.addEventListener('click', () => {
            this.close();
            this.triggerEvent('onclose');
          });
          break;

        case leng:
          if (JSON.stringify(keyLayout) === JSON.stringify(keyLayoutEn)) {
            (keyElement.textContent = 'ru');
          } else {
            (keyElement.textContent = 'en');
          }

          keyElement.addEventListener('click', () => {
            if (JSON.stringify(keyLayout) === JSON.stringify(keyLayoutEn)) {
              keyLayout = keyLayoutRu.slice(0);
            } else {
              keyLayout = keyLayoutEn.slice(0);
            }
            // console.log(this._createKeys(keyLayout));
            this.elements.keysContainer.innerHTML = '';
            this.elements.keysContainer.appendChild(
              this.createKeys(keyLayout),
            );
          });
          break;

        default:
          keyElement.textContent = key.toLowerCase();
          keyElement.classList.add('keyboard__letter');
          keyElement.addEventListener('click', () => {
            this.properties.value += this.properties.capsLock
              ? key.toUpperCase()
              : key.toLowerCase();
            this.triggerEvent('oninput');
          });

          break;
      }

      fragment.appendChild(keyElement);

      if (insertLineBreak) {
        fragment.appendChild(document.createElement('br'));
      }
    });

    return fragment;
  }

  triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] === 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  }

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    this.elements.keys.forEach((key) => {
      const keyElement = key;
      if (keyElement.childElementCount === 0) {
        keyElement.textContent = this.properties.capsLock
        && Array.from(key.classList).indexOf('keyboard__letter') !== -1
          ? key.textContent.toUpperCase()
          : key.textContent.toLowerCase();
      }
    });
  }

  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  }

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  }
}

window.onload = () => {
  document.querySelector('.container').innerHTML = '<textarea class="textarea use-keyboard-input" name="" id="q"></textarea>';
  const keyboard = new Keyboard();
  keyboard.init();
};
