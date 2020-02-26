let newData = []

let keys = Object.keys(data[0]);

keys.forEach((key) => {
    let sum = 0;
    let num = 0;
    data.forEach((datum) => {
        if (key in datum) {
            sum += datum[key];
            num++;
        }
    })
    let avg = sum / num;
    if (!isNaN(avg)) {
        let newDataPoint = {
            'name': camelCaseToSentence(key),
            'average': avg,
            'numMeasurements': num
        }
        newData.push(newDataPoint);
    }
})

newData.forEach((dataPoint) => {
    let bar = document.createElement('div');
    bar.className = 'bar';
    bar.innerHTML = dataPoint.name;

    let randomColor = Math.floor(Math.random() * 16777215).toString(16);
    bar.style.backgroundColor = "#" + randomColor;
    document.getElementById('viz').appendChild(bar);
    setTimeout(() => {
        bar.style.width = (dataPoint.average * 10) + "%";
    }, 100)
})

function camelCaseToSentence(text) {

    let result = text.replace(/([A-Z])/g, " $1");
    let finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult
}