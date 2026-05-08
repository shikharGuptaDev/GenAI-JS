import 'dotenv/config'
import dotenv from 'dotenv';
import { OpenAI } from 'openai'

dotenv.config();

console.log("API KEY:", process.env.OPENAI_API_KEY); // debug 
const client = new OpenAI(
    {
        apiKey: process.env.OPENAI_API_KEY
        //   apiKey: "AIzaSyCkO2ocNG_M9mz-2cmew84FUKMSt3l-VCk",
        //  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
    }
);

console.log("API KEY:", process.env.OPENAI_API_KEY); // debug

async function main(params) {

    const SYSTEM_PROMPT = `
    You are an AI assistant  who works on START , THINK, EVALUATE and OUTPUT format.
    For a given user query first think and breakdown the problem into sub problems
    You should  always keep thinking and thinking before giving the actual output.\
    Also, before outputing the final reesult to user you must check once if everything is correct

    Rules: 
    - Strictly follow the output JSON format
    - Always follow the output in sequence that is START, THINK, EVALUATE and OUTPUT
    - After every think, there is going to be an EVALUATE step that is performed manually by someone and you need to wait for it.
    - Always perform only one step at a time and wait for other step.
    - Alway make sure to do mulitple steps of thinking before giving out output.

    Otuput JSON Format:
    { "step": "START | THINK | EVALUATE | OUTPUT"  ,"content": "string" }

    Example :
    User : Can you solve 3 + 4 * 10 - 4 * 3
    ASSISTANT: { "step": "START", "content":"The user wants me to solve 3 + 4 * 10 - 4 * 3 maths problem"}
    ASSISTANT: { "step": "THINK" , "content": "This is typical math problem where we use BODMAS formula for calculation" }
    ASSISTANT: { "step": "EVALUATE" , "content": "Alright, Going good" }
    ASSISTANT: { "step": "THINK", "content": "Lets breakdown the problem step by step" }
    ASSISTANT: { "step": "EVALUATE" , "content": "Alright, Going good" }
    ASSISTANT: { "step": "THINK", "content": "As per bodmas, first lets solve all mulutiplications and divisions" }
    ASSISTANT: { "step": "EVALUATE" , "content": "Alright, Going good" }
    ASSISTANT: { "step": "THINK", "content": "So, first we need to solve 4* 10 that is 40" }
    ASSISTANT: { "step": "EVALUATE" , "content": "Alright, Going good" }
    ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 4 * 3" }
    ASSISTANT: { "step": "EVALUATE" , "content": "Alright, Going good" }
    ASSISTANT: { "step": "THINK", "content": "Now, I can see one more multiplication to be done that is 4 * 3 = 12" }
    ASSISTANT: { "step": "EVALUATE" , "content": "Alright, Going good" }
    ASSISTANT: { "step": "THINK", "content": "Great, now the equation looks like 3 + 40 - 12" }
    ASSISTANT: { "step": "EVALUATE" , "content": "Alright, Going good" }
    ASSISTANT: { "step": "THINK", "content": "As we have done all multiplications lets do the add and subtract" }
    ASSISTANT: { "step": "EVALUATE" , "content": "Alright, Going good" }
    ASSISTANT: { "step": "THINK", "content": "so, 3 + 40 = 43" }
    ASSISTANT: { "step": "EVALUATE" , "content": "Alright, Going good" }
    ASSISTANT: { "step": "THINK", "content": "new equations look like 43 - 12 which is 31" }
    ASSISTANT: { "step": "EVALUATE" , "content": "Alright, Going good" }
    ASSISTANT: { "step": "THINK", "content": "great, all steps are done and final result is 31" }
    ASSISTANT: { "step": "EVALUATE" , "content": "Alright, Going good" }
    ASSISTANT: { "step": "OUTPUT", "content": "3 + 4 * 10 - 4 * 3 = 31" }
    `;

    const messages = [{
        role: 'system',
        content: SYSTEM_PROMPT
    }
        , { "role": "user", "content": "write a code in JS to find  a prime number as fast as possible" },
    ]
    //write a code in JS to find  a prime number as fast as possible
    //Hey, can you solve 4 * 6 - 12 * 34 / 7 * 21

    while (true) {
        const response = await client.chat.completions.create({
            model: 'gpt-4.1-mini',
            // model: "gemini-3-flash-preview",
            messages: messages
        })



        const rawContent = response.choices[0].message.content
        const parsedContent = JSON.parse(rawContent)
        messages.push({ role: 'assistant', content: JSON.stringify(parsedContent) })

        if (parsedContent.step === 'START') {
            console.log('d', parsedContent.content)
            continue
        }
        if (parsedContent.step === 'THINK') {
            console.log('s', parsedContent.content)

            //TODO : sent the messages as history to maybe gemini and ask for a review and append it to history | cloude |
            //LLM as a judge techniuqe
            messages.push(
                {
                    role: 'developer',
                    content: JSON.stringify({
                        step: 'EVALUATE',
                        content: 'Alright, Going good'
                    }
                    )
                }
            );

             continue;
        }
        // if ... else 


        if (parsedContent.step === 'OUTPUT') {
            console.log('w', parsedContent.content)
            continue
        }
    }

    console.log('Done ..')
}

main();