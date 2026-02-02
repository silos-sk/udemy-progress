'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////////////////
//// Button Scrolling

// 200 :: Implementing Smooth Scrolling

btnScrollTo.addEventListener('click', function(e){
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);

  console.log(e.target.getBoundingClientRect());

  console.log('Current scrolll (X/Y)', window.scrollX, scrollY);
  
  console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

    // Scrolling
// window.scrollTo(s1coords.left + window.scrollX, s1coords.top + window.scrollY);

// Smooth scrolling
// old school - manually calculating values
// window.scrollTo({
//   left: s1coords.left + window.scrollX,
//   top: s1coords.top + window.scrollY,
//   behavior: 'smooth'
// })

// modern way = only works in modern browsers
  section1.scrollIntoView({behavior: 'smooth'});

});

// 204 :: Event Delegation - Implementing Page Navigation
//////////////////////////////////////////////////////////
//// Page Navigation

// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click', function(e){
//     e.preventDefault();
//     const id = this.getAttribute('href'); 
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//   })
// })

// 1. Add event listener to common parent element
// 2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function(e){
  console.log(e.target);
  e.preventDefault();

  // Matching strategy
  if(e.target.classList.contains('nav__link')){
    const id = e.target.getAttribute('href'); 
    console.log(id);
    document.querySelector(id).scrollIntoView({behavior: 'smooth'});
  }
})




/// LECTURES

// 198 :: Selecting, Creating, and Deleting Elements
// const header = document.querySelector('.header');

// const allSections = document.querySelectorAll('section');
// // console.log(allSections);

// document.getElementById('section--1'); 
// const allButtons = document.getElementsByTagName('button'); // HTML collection; live nums

// // console.log(allButtons);

// // console.log(document.getElementsByClassName('btn'));

// // Creating and inserting elements

// const message = document.createElement('div');
// message.classList.add('cookie-message');
// // message.textContent = 'We use cookies for improved functionality and analytics.';
// message.innerHTML = 'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookie">Got it!</button>';

// // header.prepend(message);
// header.append(message);
// // header.append(message.cloneNode(true));

// // header.before(message);
// // header.after(message);


// // // Delete elements
// document.querySelector('.btn--close-cookie').addEventListener('click', function(){
//   message.remove();
// })

// // 199 :: Styles, Attributes, Classes

// // Styles
// message.style.backgroundColor = '#37383d';

// message.style.width = '120%';

// console.log(getComputedStyle(message).color);

// message.style.height = Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

// //change style from css variables
// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // Attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.className);

// logo.alt = 'Beautiful minimalist logo';

// // Non-standard
// console.log(logo.designer); // undefined
// console.log(logo.getAttribute('designer'));
// logo.setAttribute('company', 'Bankist');

// console.log(logo.src); // absolute url
// console.log(logo.getAttribute('src')); // relative url

// const link = document.querySelector('.nav__link--btn');
// console.log(link.href);
// console.log(link.getAttribute('href'));

// // Data attributes
// console.log(logo.dataset.versionNumber);

// // Classes
// logo.classList.add('c', 'j')
// logo.classList.remove('c')
// logo.classList.toggle('c')
// logo.classList.contains('c'); // not includes like in arrays

// // Don't use = overwrites ALL existing classes
// logo.className = 'jonas'




// 201 :: Types of Events and Event Handlers

// const h1 = document.querySelector('h1');

// const alertH1 = function(e){
//   alert('addEventlister: Great! you are reading the heading :D');

//   // h1.removeEventListener('mouseenter', alertH1);
//  }

// // fires when mouse enters 
// h1.addEventListener('mouseenter', alertH1);

// setTimeout(()=> h1.removeEventListener('mouseenter', alertH1), 3000);

// old school - function overrides another one if another one used after it
// h1.onmouseenter = function(e){
//   alert('onmouseenter: Great! another mouse enter')
// }

// 203 :: Event Propagation in Practice
// rgb(255,255,255)

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

// const randomColor = () => `rgb(${randomInt(0,255)}, ${randomInt(0,255)}, ${randomInt(0,255)})`;

// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('LINK', e.target, e.currentTarget);
//   console.log(e.currentTarget === this);
// })

// document.querySelector('.nav__links').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('CONTAINER', e.target, e.currentTarget);
// })

// document.querySelector('.nav').addEventListener('click', function(e){
//   this.style.backgroundColor = randomColor();
//   console.log('NAV', e.target, e.currentTarget);
// })

