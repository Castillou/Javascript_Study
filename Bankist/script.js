'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.getElementById('section--1');

const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations_tab');
const tabsContainer = document.querySelector('.operations_tab-container');
const tabsContent = document.querySelectorAll('.operations_content');

/////////////////////////////////////////////////
// Modal Window Control
const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach((btn) => btn.addEventListener('click', openModal));
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

/////////////////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (e) {
    // Scroll 하려는 요소의 좌표
    const s1coords = section1.getBoundingClientRect();
    // console.log(s1coords);

    // Event가 발생한 요소의 좌표
    // console.log(e.target.getBoundingClientRect());

    // 현재 스크롤 위치
    // console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

    // viewport의 w, h
    // console.log('height/width viewport', document.documentElement.clientHeight, document.documentElement.clientWidth);

    // Scrolling
    // scrollTo(left position, top position)
    // -> 보여지는 위치의 top -> 스크롤 후 클릭하면 값이 바뀜
    // window.scrollTo(s1coords.left + window.pageXOffset, s1coords.top + window.pageYOffset);

    // window.scrollTo({
    //     left: s1coords.left + window.pageXOffset,
    //     top: s1coords.top + window.pageYOffset,
    //     behavior: 'smooth',
    // });

    // Mordern Way
    // 스크롤하고자 하는 요소.scrollIntoView() :
    section1.scrollIntoView({ behavior: 'smooth' });
});

// Event Delegation (이벤트 위임)
// 1. Add event listener to common parent element
// 2. Determine what element originated the event (Where the event was actually created)
document.querySelector('.nav_links').addEventListener('click', function (e) {
    e.preventDefault();
    console.log(e.target);

    // Matching Strategy
    if (e.target.classList.contains('nav_link')) {
        const id = e.target.getAttribute('href');
        document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
});

/////////////////////////////////////////////////
// Tabbed component
tabsContainer.addEventListener('click', function (e) {
    const clicked = e.target.closest('.operations_tab');
    // console.log(clicked);

    // Guard clause
    if (!clicked) return;

    // Remove active classes
    tabs.forEach((t) => t.classList.remove('operations_tab--active'));
    tabsContent.forEach((c) => c.classList.remove('operations_content--active'));

    // Activate tab
    clicked.classList.add('operations_tab--active');

    // Activate content area
    document.querySelector(`.operations_content--${clicked.dataset.tab}`).classList.add('operations_content--active');
});

/////////////////////////////////////////////////
// Menu fade animation
const handleHover = function (e) {
    if (e.target.classList.contains('nav_link')) {
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav_link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach((el) => {
            if (el !== link) el.style.opacity = this;
        });
        logo.style.opacity = this;
    }
};

// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////////////////////
// Sticky navigations: Intersection Observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
    const [entry] = entries;
    // console.log(entry);

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

/////////////////////////////////////////////////
// Reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entris, observer) {
    const [entry] = entris;
    // console.log(entry);

    // 교차하지 않으면 반환
    if (!entry.isIntersecting) return;

    // 교차하는 경우
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
});

allSections.forEach(function (section) {
    sectionObserver.observe(section);
    section.classList.add('section--hidden');
});

/////////////////////////////////////////////////
// Lazy loading images
// 스크롤 시: 저해상도 > 고해상도 이미지 교체
// 인터넷 연결 혹은 데이터 공급이 느릴 경우 성능면에서 우수함
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
    const [entry] = entries;
    // console.log(entry);

    if (!entry.isIntersecting) return;

    // Replace src with data-src
    // javascript는 load & display할 새 이미지를 찾음
    // > load 가 끝나면 event 방출
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img');
    });

    observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '-200px', // px, % 단위만 사용 가능
});

imgTargets.forEach((img) => imgObserver.observe(img));

/////////////////////////////////////////////////
// Slider 구현
const slider = function () {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider_btn--left');
    const btnRight = document.querySelector('.slider_btn--right');
    const dotContainer = document.querySelector('.dots');

    let curSlide = 0;
    const maxSlide = slides.length;

    // Functions
    const createDots = function () {
        slides.forEach(function (_, i) {
            dotContainer.insertAdjacentHTML('beforeend', `<button class = "dots_dot" data-slide = "${i}"></button>`);
        });
    };

    const activateDot = function (slide) {
        document.querySelectorAll('.dots_dot').forEach((dot) => dot.classList.remove('dots_dot--active'));

        document.querySelector(`.dots_dot[data-slide = "${slide}"]`).classList.add('dots_dot--active');
    };

    const goToSlide = function (slide) {
        slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
    };

    const nextSlide = function () {
        if (curSlide === maxSlide - 1) {
            curSlide = 0;
        } else {
            curSlide++;
        }
        goToSlide(curSlide);
        activateDot(curSlide);
    };

    const prevSlide = function () {
        if (curSlide === 0) {
            curSlide = maxSlide - 1;
        } else {
            curSlide--;
        }
        goToSlide(curSlide);
        activateDot(curSlide);
    };

    const init = function () {
        goToSlide(0);
        createDots();

        activateDot(0);
    };

    init();

    // Event Handlers
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') prevSlide();
        e.key === 'ArrowRight' && nextSlide();
    });

    dotContainer.addEventListener('click', function (e) {
        if (e.target.classList.contains('dots_dot')) {
            const { slide } = e.target.dataset;
            goToSlide(slide);
            activateDot(slide);
        }
    });
};
slider();

/* 
DOM API 
1. Inheritance ('EventTarget' method)
- Can call addEventListener on every single type node


///////////////////////////////////////////
// Creating and inserting elements
const msg = document.createElement('div');
msg.classList.add('cookie-message');

msg.innerHTML =
    'We use cookied for improved functional and analytics. <button class ="btn btn--close--cookie">Got it!</button>';

// parent.prepend(child) : parent 요소의 첫 번째 자식으로 child를 추가
// parent.append(child) : parent 요소의 마지막 자식으로 child를 추가
// => 요소를 삽입하는 것이 아니고 존재하는 요소를 이동시키는 역할
// parent.before(child)
// parent.after(child)

// header.prepend(msg);
header.append(msg);
// header.append(msg.cloneNode(true));

///////////////////////////////////////////
// Delete elements
document.querySelector('.btn--close--cookie').addEventListener('click', function () {
    // msg.remove();
    msg.parentElement.removeChild(msg); // 예전 방식
});

// Styles (inline-style)
msg.style.backgroundColor = '#37383d';
msg.style.width = '100%';

// style 프로퍼티 사용 시 class 내부(inline)에 숨겨져 있는 값은 가져올 수 없다.
console.log(msg.style.color);
console.log(msg.style.backgroundColor);
// => getComputedStyle() 사용 시 값에 접근하여 가져올 수 있음
// (* 값은 String으로 가져옴)
console.log(getComputedStyle(msg).fontSize);

msg.style.height = Number.parseFloat(getComputedStyle(msg).height, 10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary', 'tomato');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.className);

// Non-standard
console.log(logo.designer);
console.log(logo.getAttribute('designer'));

logo.setAttribute('company', 'Bankist');
console.log(logo.getAttribute('company'));

console.log(logo.src); // absolute
console.log(logo.getAttribute('src')); // relative

const link = document.querySelector('.twitter_link');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data-attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c', 'j');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c');

// Don't use (기존의 class명을 모두 덮어씌움)
// logo.className = 'sean';

// Random Color
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = (min, max) => `rgb(${randomInt(min, max)}, ${randomInt(min, max)},${randomInt(min, max)})`;
console.log(randomColor(0, 255));

const nvlink = document.querySelectorAll('.nav_link');
nvlink.addEventListener('click', function (e) {
    console.log('LINK');
    // this : event handler가 첨부된 요소를 가리킴
    this.style.backgroundColor = randomColor();
});

// DOM Traversing
// Traversing : 어떠한 특정 태그를 기준으로 내가 찾고자 하는 태그들을 추적을 하는 기능을 하는 함수
// 1. HTMLCollection : 노드 객체의 상태 변화를 실시간으로 반영하는 살아있는 live DOM 컬렉션 객체
// 2. NodeList : 노드 객체의 상태 변화를 반영하지 않는 non-live DOM 컬렉션 객체

const h1 = document.querySelector('h1');

// Going downwards : child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes); // NodeList
console.log(h1.children); // HTMLCollection [권장]

// Going upwards : parents
console.log(h1.parentNode);
console.log(h1.parentElement);

// closest() : receives query string like querySelector
// selected closest header to h1 elements
h1.closest('.header');

// Going sideways : siblings
// 1. Element [주로 사용]
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

// 2. Node
console.log(h1.previousSibling);
console.log(h1.nextSibling);

// Example
console.log(h1.parentElement.children);

// 'Scroll' Event는 스크롤한 값이 아무리 작아도 계속 동작하기 때문에 성능 면에서 좋지 않음 -> 특히 모바일에서 최악

// Intersection Observer API (교차점 관찰자 API)
const obsCallback = function (entries, observer) {
    entries.forEach((entry) => {
        console.log(entry);
    });
};

// 1. root : target이 교차(intersecting)하는 요소
// (요소를 선택할 수도 있고 null을 할당할 수도 있음)
// > null : viewport를 교차하는 target 요소를 관찰

// 2. threshold(임계값) : 콜백함수가 호출될 때 교차 영역의 비율
// > 0 : 겹치는 부분이 0인 경우 = 대상 요소가 뷰 밖으로 완전히 나갈때 혹은 뷰에 들어올 때 마다 콜백을 호출
// > 1: viewpoint에서 타겟의 100%가 보일때만 콜백을 호출
// ※ 배열도 할당 가능 (ex. [0, 0.2, 1])
const obsOptions = {
    root: null,
    threshold: 0,
};

const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1); // target === section1

*/

// DOMContentLoaded : DOM tree 분석이 끝나면 발생
document.addEventListener('DOMContentLoaded', (e) => {
    console.log('HTML parsed and DOM tree built!', e);
});

// load : DOM tree 이후 모든 리소스까지 완전히 불러온 후에 발생
window.addEventListener('load', function (e) {
    console.log('Page fully loaded', e);
});

// beforeunload : user가 페이지를 떠나기 전에 발생
// ex. 주로 페이지를 떠날 것이냐는 메세지와 함께 사용
// window.addEventListener('beforeunload', function (e) {
//     e.preventDefault();
//     console.log(e);
//     e.returnValue = '';
// });
