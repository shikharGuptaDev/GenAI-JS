import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';

const getCurrentTime = tool({
  name: 'get_current_time',
  description: 'This tool returns the current time',
  parameters: z.object({}),
  async execute() {
    return new Date().toString();
  },
});

const getMenuTool = tool({
  name: 'get_menu',
  description: 'Fetches and returns the menu items',
  needsApproval : true,
  parameters: z.object({}),
  async execute() {
    return {
      Drinks: {
        Chai: 'INR 50',
        Coffee: 'INR 70',
      },
      Veg: {
        DalMakhni: 'INR 250',
        Panner: 'INR 400',
      },  
    };
  },
});

const cookingAgent = new Agent({
  name: 'Cooking Agent',
  model: 'gpt-4.1-mini',
  tools: [getCurrentTime, getMenuTool],
  instructions: `
    You're a helpfull cooking assistant who is speacialized in cooking food.
    You help the users with food options and receipes and help them cook food
  `,
});

const codingAgent = new Agent({ //${RECOMMENDED_PROMPT_PREFIX}
  name: 'Coding Agent',
  instructions: `
  
  YOU ARE assistant
        You are an expert coding assistant particullarly in Javascript
    `,
});

const gatewayAgent = Agent.create({
  name: 'Triage Agent',
  instructions: `
  
    You have list of handoffs which you need to use to handoff the current user query to the correct agent.
    You should hand off toCoding Agent if user asks about a coding question.
    You should hand off to Cooking Agent if question is realted to Cooking.
  `,
  handoffs: [codingAgent, cookingAgent],
});

async function confirm(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
    for (const interruption of result.interruptions) {
      const confirmed = await confirm(
        `Agent ${interruption.agent.name} would like to use the tool ${interruption.name} with "${interruption.arguments}". Do you approve?`,
      );

      if (confirmed) {
        state.approve(interruption);
      } else {
        state.reject(interruption);
      }
    }
  const answer = await rl.question(`${question} (y/n): `);
  const normalizedAnswer = answer.toLowerCase();
  rl.close();
  return normalizedAnswer === 'y' || normalizedAnswer === 'yes';
}

async function chatWithAgent(query) {
  const result = await run(gatewayAgent, query);

  console.log(`History`, result.history);
  console.log(`Hand Off Too`, result.lastAgent.name);
  console.log(result.finalOutput);
}

chatWithAgent('I want to cook a cake, what are all the menu items');