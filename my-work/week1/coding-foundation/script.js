const number = document.getElementById('number');
const sumbit = document.getElementById("submit");
const container = document.getElementById("boxContainer");
const warning = document.getElementById('warning');

const hoverCheckbox = document.getElementById('hover');
const scaleCheckbox = document.getElementById('scale');
const rotationCheckbox = document.getElementById('rotation');
const indexCheckbox = document.getElementById('index');
const fractionCheckbox = document.getElementById('fraction');



// pop up notification when changing checkbox
let checkboxes = [hoverCheckbox, scaleCheckbox, rotationCheckbox, indexCheckbox];
checkboxes.forEach((c) => {
    c.addEventListener('change', () => {
        createSquares();
    })
})

// add click listener to the button
sumbit.addEventListener('click', createSquares)

// create squares based on the input number and checkbox functions
function createSquares() {
    warning.innerHTML = '&nbsp;';

    // get the floored input number and the fraction
    let num = Math.floor(number.value);
    let remain = number.value - num;

    // pop up warning if a negative number is given or a float is given without checked support
    if (num < 0 || (remain != 0 && !fractionCheckbox.checked)) {
        warning.innerHTML = "no funny number please";
        return;
    }

    // clear up existing boxes
    let currentLength = container.childNodes.length;
    for (let i = 0; i < currentLength; i++) {
        container.childNodes[0].remove();
    }

    // generate random parameters for additional styles
    let parameters = {
        offset: Math.random() * 3.14,
        step: Math.random() * 0.5,
        maxDeg: Math.random() * 180
    }

    // create, stylize. and append boxes to the container
    for (let i = 0; i < num; i++) {
        let box = document.createElement('div')
        box.className = "box";
        addStyle(box, parameters, i);
        container.appendChild(box);
    }

    // if the input number has a fraction, add a smaller rectangle
    if (remain != 0) {
        let box = document.createElement('div')
        box.className = "box";
        box.style.width = (20 * remain).toString() + "px";
        addStyle(box, parameters, num);
        container.appendChild(box);
    }

}

// adding style to a box based on the given parapeters and index
function addStyle(box, p, i) {
    // add hover animation to the box
    if (hoverCheckbox.checked)
        box.classList.toggle("hover");

    // add random periodic scaling to the box
    if (scaleCheckbox.checked) {
        let scale = ((Math.random() + 1.5) * 0.5 * Math.abs(Math.sin(i * p.step + p.offset)));
        box.style.transform += `scale(${scale.toString()})`
    }

    // add random periodic rotation to the box
    if (rotationCheckbox.checked) {
        let angle = ((Math.random() - 0.5) * p.maxDeg * Math.sin(i * p.step + p.offset));
        box.style.transform += `rotate(${angle.toString()}deg)`
    }

    // add the index number text to the box
    if (indexCheckbox.checked) {
        box.innerHTML = (i + 1).toString();
    }
}