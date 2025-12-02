import { tool } from 'ai';
import { z } from 'zod';

export const ALL_TOOLS = {
    getWeather: tool({
        description: 'Get the current weather for a specific city',
        inputSchema: z.object({
            city: z.string().describe('The name of the city to get weather for'),
        }),
        execute: async ({ city }: { city: string }) => {
            console.log(`[Tool Call] Getting weather for: ${city}`);

            if (city.toLowerCase().includes('beijing') || city.toLowerCase().includes('北京')) {
                return {
                    city,
                    temperature: '24°C',
                    condition: 'Sunny',
                    humidity: '45%',
                };
            } else if (city.toLowerCase().includes('shanghai') || city.toLowerCase().includes('上海')) {
                return {
                    city,
                    temperature: '22°C',
                    condition: 'Partly Cloudy',
                    humidity: '60%',
                };
            } else {
                return {
                    city,
                    temperature: '20°C',
                    condition: 'Cloudy',
                    humidity: '55%',
                };
            }
        },
    }),
};
