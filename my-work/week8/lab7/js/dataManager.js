let getRandom = d3.randomNormal(50, 11);



function getRandomKey(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


let emojis = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "🙂", "🤗", "🤔", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "😬", "😰", "😱", "😳", "😵", "😡", "😠", "😷", "🤒", "🤕", "🤢", "🤧", "😇", "🤠", "🤡", "🤥", "🤓"];

function getRandomEmoji() {
    d3.shuffle(emojis);
    return emojis[0];
}

function newDatapoint() {
    let randKey = getRandomKey(5);
    let randomValue = getRandom();
    let testRandomEmoji = getRandomEmoji();
    return {
        key: randKey,
        name: testRandomEmoji,
        value: randomValue
    }
}


function initializeData() {
    for (let i = 0; i < initialNum; i++) {
        data.push(newDatapoint());
    }
}

function addDatapoints(num) {
    for (let i = 0; i < num; i++) {
        data.push(newDatapoint());
    }
    console.log("added", num, "datapoints. data:", data);
}

function removeDatapoints(num) {
    for (let i = 0; i < num; i++) {
        let randomIndex = Math.floor(Math.random() * data.length)
        data.splice(randomIndex, 1);
    }
    console.log("removed", num, "datapoints. data:", data);

}

function removeAndAddDatapoints(numR, numA) {
    removeDatapoints(numR);
    addDatapoints(numA);
}

function sortDatapoints() {
    data.sort(function (a, b) {
        return a.value - b.value
    });
    console.log("sorted data:", data);

}

function shuffleDatapoints() {
    d3.shuffle(data);
    console.log("shuffled data:", data);

}

let initialNum = 10;
let data = [];
initializeData();