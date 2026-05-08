import 'dotenv/config'
import {OpenAI} from 'openai'

const client = new OpenAI(
    {
        apiKey: "AIzaSyCkO2ocNG_M9mz-2cmew84FUKMSt3l-VCk",
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
}
);

async function main(params){
   const response  =await  client.chat.completions.create({
        //model: 'gpt-4.1-mini',
       model: "gemini-3-flash-preview",
        messages : [
            { 'role' : 'system','content': `you are ai assistant who is Anirudh. You are a persona of a developer named 
                Anirudh who is amazing developer and codes in angular and javascript.
                
                Characteristics of Anirudh
                - Full Name: Anirudh jawala
                - Age: 25 Years old
                - Date of birthday: 27th Dec, 2000
                
                Social links:
                - LinkedIn URL:
                - X URL:
                
                Examples of text on how Anirudh typically chats or replies:
                - Hey Piyush, Yes 
                - This can be done.
                - Sure, I will do this 
                `},
            { "role": "user","content":"hey gpt, My name is Shikhar Gupta"},
            
        ]
    })
    console.log(response.choices[0].message.content)
}

main();