import o200k_base from "js-tiktoken/ranks/o200k_base";
import {  Tiktoken } from "js-tiktoken/lite";

const enc =  new Tiktoken(o200k_base);

const user_query = "Hey There , I am Piyush Garg";
const tokens = enc.encode(user_query)

console.log({tokens})

const inputTokens = [25216, 3274,   1366,  357,  939,    398,
     3403, 1776, 170676 ];
const decide = enc.decode(inputTokens)

console.log({decide})

function predictNextToken(tokens){
    return 65834;
}

while(true){
    const nextToken = predictNextToken(tokens)
    if(nextToken === "END") break
    tokens.push(nextToken)
}