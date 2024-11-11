// /pages/api/putStarEvent.js
import { EventBridge } from 'aws-sdk';

const eventBridge = new EventBridge({
  region: 'us-west-1', // Replace with your AWS region
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('API Request:', req.method);
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
            timestamp: new Date().toISOString(),
          }),
        },
      ],
    };

    try {
      const result = await eventBridge.putEvents(params).promise();
      console.log('Event sent:', result);
      res.status(200).json({ message: 'Event sent successfully', result });
    } catch (error) {
      console.error('Error sending event:', error);
      res.status(500).json({ message: 'Error sending event', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
