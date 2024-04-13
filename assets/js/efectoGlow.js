// Efecto glow en hover a logo del fondo
const card = document.querySelector(".card-fondo");
card.onmousemove = e => {
    const rect = card.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
};