const floweringDurations = require('./FlowerData');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchBloomingDurationFromWeb(PlantName){
    try{
        const response = await axios.get(`https://api.plantinfo.com/v1/plants?name=${PlantName}`);
        if(response.data && response.data.blooming_duration){
            return response.data.blooming_duration;
        }
    }catch(error){
        console.error('Error Fetching Plant Date:', error);
    }
    return null; //if no data found
}


//creating funtion to update flower data 
 function updateFlowerDataFile(PlantName, bloomingDuration){
    const filePath = path.join(__dirname, 'FlowerData.js');

    fs.readFile(filePath, 'utf8', (err, data) => {P
        if (err) throw err;

        const updatedData = data.replace(
            '};',
            `   "${plantName}": ${bloomingDuration},\n};`
        );

        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if(err) throw err;
            console.log(`${plantName} added to flowerData.js`)
        });
    });
 }

 async function getBloomingDuration(PlantName){
    if(floweringDurations[PlantName]){
        return floweringDurations[PlantName];
    }

    const bloomingDuration = await fetchBloomingDurationFromWeb(PlantName);
    if(bloomingDuration){
        updateFlowerDataFile(PlantName, bloomingDuration);
        return bloomingDuration;
    }
    return 45; //DEfualt value if no blooming duration found
 }


 module.exports = getBloomingDuration;