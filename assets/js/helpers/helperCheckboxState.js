export function setCheckboxState(checkbox, status, item, visible = true) {
    checkbox.checked = visible;
    status.textContent = visible ? '[Visible]' : '[Oculto]';
    localStorage.setItem(item, visible ? 'show' : 'hide');
}
