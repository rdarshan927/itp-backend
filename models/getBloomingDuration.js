const floweringDurations = require('./FlowerData');
const axios = require('axios');
const { error } = require('console');
const fs = require('fs');
const path = require('path');

async function fetchBloomingDurationFromWeb(PlantName){
    try{
        const response = await axios.get(`https://trefle.io/api/v1/plants?token=OTxXOZAiBl0v5YM4JoVxSu33a-rqykKdnwH2aJvOz8A&q=${PlantName}`);


         if (response.data && response.data.length > 0 && response.data[0].blooming_duration) {
            return response.data[0].blooming_duration;
        } else {
            throw new Error("Invalid plant type. Please enter a valid plant name.");
        }
    }catch(error){
        console.error('Error Fetching Plant Date:', error.message);
        throw new Error("Error fetching blooming duration. Please check the plant name.");
    }
}


//update the local flowerData file if new plant is found
function updateFlowerDataFile(PlantName, bloomingDuration){
    const filePath = path.join(__dirname, 'FlowerData.js');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if(err)  throw err;

        const updateDate = data.replace(
            '}',
            `   "${PlantName}": ${bloomingDuration}, \n;`
        );

        fs.writeFile(filePath, updateDate, 'utf8', (err) => {
            if(err) throw err;
            console.log(`${PlantName} added to FlowerData.js`);
        });
    });
}

 async function getBloomingDuration(PlantName){

    if(floweringDurations[PlantName]){
        return floweringDurations[PlantName];
    }

    try {
         
        const bloomingDuration = await fetchBloomingDurationFromWeb(PlantName);

        if (bloomingDuration) {
            updateFlowerDataFile(PlantName, bloomingDuration);
            return bloomingDuration;
        }
    }catch(error){
        console.error(error.message);
        throw new Error("Invalid plant type. Please enter a valid plant name.");
    }
 }


 module.exports = getBloomingDuration;