import express from 'express';
import data from './data_management/retrieve_and_ingest_data';
import cors from 'cors';
import { client } from './elasticsearch/client';
import { SortOrder } from '@elastic/elasticsearch/lib/api/types';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import { authRoutes as identificationRoutes } from './JWT/apiRoutes';

const app = express();
const port = process.env.PORT || 3001;

dotenv.config();

app.use(cors()); //enable cors for different origin
app.use(bodyParser.json());
//URL-encoded payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

//Custom routes definitions
app.use('/ingest_data', data);
app.use('/api', identificationRoutes);

app.get('/results', (req, res) => {
  const passedType = req.query.type;
  const passedMag = req.query.mag;
  const passedLocation = req.query.location;
  const passedDateRange = req.query.dateRange;
  const passedSortOption = req.query.sortOption;

  async function sendESRequest() {
    const body = await client.search({
      index: 'weathers',
      body: {
        sort: [
          {
            mag: {
              order: passedSortOption as SortOrder,
            },
          },
        ],
        size: 300,
        query: {
          bool: {
            filter: [
              {
                term: { type: passedType },
              },
              {
                range: {
                  mag: {
                    gte: passedMag as unknown as number,
                  },
                },
              },
              {
                match: { place: passedLocation as string },
              },
              // for those who use prettier, make sure there is no whitespace.
              {
                range: {
                  '@timestamp': {
                    gte: `now-${passedDateRange}d/d`,
                    lt: 'now/d',
                  },
                },
              },
            ],
          },
        },
      },
    });
    res.json(body.hits.hits);
  }
  sendESRequest();
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});
