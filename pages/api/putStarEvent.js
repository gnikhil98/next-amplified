import { EventBridge } from 'aws-sdk';
const AWS = require('aws-sdk');

// Ensure environment variables are set
const accessKeyId = process.env.ACCESS_KEY_ID;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;
const region = process.env.REGION;

if (!accessKeyId || !secretAccessKey || !region) {
  console.error("Missing required environment variables:");
  console.error("ACCESS_KEY_ID:", accessKeyId);
  console.error("SECRET_ACCESS_KEY:", secretAccessKey);
  console.error("REGION:", region);
  throw new Error("Missing required AWS credentials or region in environment variables.");
}

// Configure AWS SDK
AWS.config.update({
  region: region,
  credentials: new AWS.Credentials(accessKeyId, secretAccessKey),
});

const eventBridge = new AWS.EventBridge();

export default async function handler(req, res) {
  console.log('Request Method:', req.method);

  if (req.method === 'POST') {
    console.log('Received POST request');
    
    const params = {
      Entries: [
        {
          EventBusName: 'arn:aws:events:us-west-1:464871392770:event-bus/hypp_event_bus',
          Source: 'hyypApp',
          DetailType: 'star_event',
          Detail: JSON.stringify({
            userId: 99,
            starRating: 88,
            name: 'hyyp',
            from: 'code trigger',
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    };

    try {
      const result = await eventBridge.putEvents(params).promise();
      console.log('Event sent successfully:', result);
      res.status(200).json({ message: 'Event sent successfully', result });
    } catch (error) {
      console.error('Error sending event:', error);
      res.status(500).json({ message: 'Error sending event', error: error.message });
    }
  } else {
    console.error('Invalid method:', req.method);
    res.status(405).json({ message: 'Method not allowed' });
  }
}
