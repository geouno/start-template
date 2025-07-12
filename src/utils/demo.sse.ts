import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js'

import guitars from '@/data/example-guitars'

export const server = new McpServer({
  name: 'guitar-server',
  version: '1.0.0',
})
export const transports: { [sessionId: string]: SSEServerTransport } = {}

server.tool('getGuitars', {}, async ({}) => {
  // Use dynamic base URL that works in both dev and production
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'
      
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          guitars.map((guitar) => ({
            id: guitar.id,
            name: guitar.name,
            description: guitar.description,
            price: guitar.price,
            image: `${baseUrl}${guitar.image}`,
          })),
        ),
      },
    ],
  }
})
