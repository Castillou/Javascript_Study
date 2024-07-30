"use strict";

// Elements
const Modal = document.querySelector(".modal");
const Overlay = document.querySelector(".overlay");
const btnOpenModal = document.querySelectorAll(".show-modal");
const btnCloseModal = document.querySelector(".close-modal");

// openModal -> Modal & overlay class remove 'hidden'
const openModal = function () {
  Modal.classList.remove("hidden");
  Overlay.classList.remove("hidden");
};

//closeModal -> Modal & overlay class add 'hidden'
const closeModal = function () {
  Modal.classList.add("hidden");
  Overlay.classList.add("hidden");
};

// for btnOpenModal[i] -> click -> openModal
for (let i = 0; i < btnOpenModal.length; i++) {
  btnOpenModal[i].addEventListener("click", openModal);
}

// btnCloseModal -> click -> closeModal
btnCloseModal.addEventListener("click", closeModal);

// overlay -> click -> closeModal
Overlay.addEventListener("click", closeModal);

// document -> keydown -> element.key === "Escape" & !modal.classList.contains('hidden') => closeModal
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !Modal.classList.contains("hidden")) {
    console.log(e.key);
    closeModal();
  }
});
