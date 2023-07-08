import './styles/main.scss';
import Bananas from './assets/Bananas.svg';
import helloWorld from './helloWorld';

const img = document.createElement('img');
img.src = Bananas;
document.body.append(img);

const p = document.createElement('p');
p.textContent = helloWorld();
document.body.append(p);

console.log("Hello World!");
