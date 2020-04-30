const fs = require('fs');

let rawdata = fs.readFileSync('camera_details_cleaned.json');
let camera_details = JSON.parse(rawdata);

let keys = Object.keys(camera_details[0])

camera_details.forEach(camera => {
    keys.forEach(key => {
        if (camera[key] === null || camera[key] === '') {
            delete camera[key]
        }
    });
});

console.log(camera_details)

let data = JSON.stringify(camera_details);

fs.writeFile('camera_details_cleaned_trimmed.json', data, (err) => {
    if (err) throw err;
    console.log('Data written to file');
});