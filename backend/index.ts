import { Request, Response } from "express";
import { rateLimit } from 'express-rate-limit'
import express from "express";
import cors from 'cors';
import OpenAI from "openai";

const app = express();
const port = 3000;

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: 'draft-7', // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
	legacyHeaders: false, // X-RateLimit-* headers
	// store: ... , // Use an external store for more precise rate limiting
});


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const functions = [
  {
    name: "explainText",
    description: "Explains a users textual query to them.",
    parameters: {
      type: "object",
      properties: {
        explanation: {
          type: "string",
          description:
            "The explanation of the selection we should provide to the user.",
        },
        suggested_queries: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            "A list of 3 short google search queries that may help the user get a better understanding of the subject.",
        },
        suggested_viewpoints: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            "A list of 3 other roles the explainer could be that are relevant to the selection. (ex, mathematician, architect, etc)",
        },
        topic_tags: {
          type: "array",
          items: {
            type: "string",
          },
          description:
            "A list of 5 topics that are most relevant to the selection.",
        },
      },
    },
  },
];

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use(limiter);

app.post("/explain", async (req: Request, res: Response) => {
  if (!process.env.OPENAI_API_KEY) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const reqbody = req.body || {};
  const reqLen = JSON.stringify(reqbody).trim().length;

  if (reqLen === 0 || reqLen > 2000) {
    res.status(400).json({
      error: {
        message: "Please enter a valid query",
      },
    });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: generateMessages(reqbody),
      temperature: 0.6,
      functions: functions,
      function_call: "auto"
    });
    res.status(200).json(JSON.parse(completion.choices[0].message.function_call.arguments));
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // Consider adjusting the error handling logic for your use case
      if (error.response) {
        console.error(error.response.status, error.response.data);
        res.status(error.response.status).json(error.response.data);
      } else {
        console.error(`Error with OpenAI API request: ${error.message}`);
        res.status(500).json({
          error: {
            message: "An error occurred during your request.",
          },
        });
      }
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

function generateMessages(req: string) {
  return [
    {
      role: "system",
      content: `You are an explanation agent for the ELI5 reddit.
However, you have been augmented with the capability to provide explanations that are more relevant to tthe user based off the current level of understanding. Each user will provide a selection of text, the url and context where it came from, and their own level of understanding on different topics. The levels of understanding will be out of 10, where 10 is supposed to represent a PHD in the subject and 1 is supposed to be the understanding level of a 5 year old. By default assume a user is requesting a 5 year old level explanation. Assume a basic teaching role, unless the user has specified a desired viewpoint.

Please respond by calling the explainText function.`,
    },
    { role: "user", content: JSON.stringify(req) },
  ];
}
