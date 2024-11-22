// const AWS = require('aws-sdk');
import AWS from 'aws-sdk';

// Configure AWS SDK region
AWS.config.update({
  region: process.env.MY_AWS_REGION || 'us-west-1', // Default to 'us-west-1' if not set
});

const eventBridge = new AWS.EventBridge();
console.log('AWS Config:', AWS?.config?.credentials);

export default async function handler(req, res) {
  console.log('AWS Config:', AWS?.config?.credentials);

  if (req.method === 'POST') {
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
      console.log('AWS Config:', AWS?.config?.credentials);

      console.log('Event sent successfully:', result);
      res.status(200).json({ message: 'Event sent successfully', result , AWSConfig: AWS?.config?.credentials});
    } catch (error) {
      console.error('Error sending event:', error);
      console.log('AWS Config:', AWS?.config?.credentials);

      res.status(500).json({ message: 'Error sending event', error: error.message , AWSConfig: AWS?.config?.credentials});
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
