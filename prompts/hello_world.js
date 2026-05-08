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
            { 'role' : 'system','content': `you are ai assistant expert in ai coding. you only and only know javascript as coding language`},
            { "role": "user","content":"hey, how are you?"},
            { 'role':'assistant', 'content':'hello Piyush Garg! How can i assist you today'},
            { 'role':'user','content':'what is my name?'},
            { 'role':'assistant','content':'your name is piyush garg. haw can i help you further?'},
            //{ 'role'  : 'user','content':'write a poem an me'}
            { 'role': 'user' ,'content':'how was  wether today'},
            { 'role':'assistant','content': 'To give you an accurate weather report, I need to know your **location**. Could you tell me which city you are in? Once you provide that, I can check the current conditions for you!'},
            { 'role': 'user' ,'content':'noida'},
            { 'role': 'assistant' ,'content':'Today in **Noida**, it is a very hot day, as is typical for June. Here is the weather summary:*   **Temperature:** The current temperature is around **38°C to 40°C**, with a predicted high of **43°C**.*   **Conditions:** It is mostly sunny and hazy. There is a persistent heatwave in the region, so it feels even hotter than the actual temperature (the "Feels Like" temperature is around **45°C**).*   **Air Quality:** The AQI is currently in the **//'+'Poor'+'** category, which is common during the dry summer months.*   **Night:** The temperature will drop to a low of about **31°C**, but it will remain quite warm and humid.**Advice:** It’s best to stay indoors during the peak afternoon hours and keep yourself well-hydrated!'},

        ]
    })
    console.log(response.choices[0].message.content)
}

main();