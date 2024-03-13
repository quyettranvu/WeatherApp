import { client } from "./elasticsearch/client";

//The API key for connecting to Elasticsearch cloud without the need to use username and password
async function generateApiKeys(){
    const body = await client.security.createApiKey({
      name: 'weather_app',
      role_descriptors: {
        weathers_example_writer: {
          cluster: ['monitor'],
          index: [
            {
              names: ['weathers'],
              privileges: ['create_index', 'write', 'read', 'manage'],
            },
          ],
        },
      },
    });
    return Buffer.from(`${body.id}:${body.api_key}`).toString('base64');
}

generateApiKeys()
    .then(console.log)
    .catch(err=>{console.error(err); process.exit(1)});

