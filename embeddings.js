import 'dotenv/config'
import {OpenAI} from 'openai'

const client = new OpenAI({
     apiKey: process.env.OPENAI_API_KEY,
})

async function init(){ 

const result = await client.embeddings.create({
    model : 'text-embedding-3-small',
    input : 'i love to visit new zealand',
    encoding_format : "float"
});
console.log(result.data)
}

init();