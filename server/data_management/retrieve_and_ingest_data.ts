import express from 'express';
import axios from 'axios';
import { client } from '../elasticsearch/client';
import 'log-timestamp'; //prepend timestamp

const router = express.Router();

const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson`;

router.get('/weathers', async (req, res) => {
  console.log('Loading Application...');
  res.json('Running Application...');

  // Call indexData here
  await indexData();
});

const indexData = async () => {
  try {
    console.log('Retrieving data from the USGS API');

    //receive HTTP request from browser and retrieve DATA API
    const EARTHQUAKES = await axios.get(`${URL}`, {
      headers: {
        'Content-Type': ['application/json', 'charset=utf-8'],
      },
    });

    //send retrieved data to Elasticsearch pipeline(weather_data_pipeline) for data transformation
    console.log('Data retrieved!');
    const results = EARTHQUAKES.data.features;

    console.log('Indexing data...');
    //instruct Elasticsearch to ingest the transformed data into 'weathers' index
    results.map(async (result: any) => {
      const earthquakeObject = {
        place: result.properties.place,
        time: result.properties.time,
        tz: result.properties.tz,
        url: result.properties.url,
        detail: result.properties.detail,
        felt: result.properties.felt,
        cdi: result.properties.cdi,
        alert: result.properties.alert,
        status: result.properties.status,
        tsunami: result.properties.tsunami,
        sig: result.properties.sig,
        net: result.properties.net,
        code: result.properties.code,
        sources: result.properties.sources,
        nst: result.properties.nst,
        dmin: result.properties.dmin,
        rms: result.properties.rms,
        mag: result.properties.mag,
        magType: result.properties.magType,
        type: result.properties.type,
        longitude: result.geometry.coordinates[0],
        latitude: result.geometry.coordinates[1],
        depth: result.geometry.coordinates[2],
      };

      await client.index({
        index: 'weathers',
        id: result.id,
        body: earthquakeObject,
        pipeline: 'weather_data_pipeline',
      });
    });

    if (EARTHQUAKES.data.length > 0) {
      indexData();
    } else {
      console.log('All datas have been indexed successfully!');
    }
  } catch (error) {
    console.error('Error encountered while retrieving: ', error);
  }
  console.log('Preparing for the next round of indexing...');
};

export default router;
