//This is Elasticsearch client for connecting server to Elasticsearch cloud
import { Client } from '@elastic/elasticsearch';
import config from "config";

interface ElasticConfig {
  cloudID: string;
  username: string;
  password: string;
}

const elasticConfig: ElasticConfig = config.get('elastic');

export const client = new Client({
    cloud: {
        id: elasticConfig.cloudID,
    },
    auth: {
        username: elasticConfig.username,
        password: elasticConfig.password,
    },
});

console.log(client);

client.ping()
    .then(response => console.log("You are connected to Elasticsearch Cloud"))
    .catch(error=>console.error("Elasticsearch is not connected!"));
