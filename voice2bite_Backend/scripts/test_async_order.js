import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const connection = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

const orderQueue = new Queue('OrderQueue', { connection });

const runTest = async () => {
    console.log("--- Phase 4: Async Order Pipeline Test ---");
    
    const trackingId = `test_order_${uuidv4()}`;
    console.log(`[1] Generated Tracking ID: ${trackingId}`);

    // Connect Socket.IO client to the backend
    const socket = io('http://localhost:4000');
    
    socket.on('connect', async () => {
        console.log(`[2] Socket connected! ID: ${socket.id}`);
        
        // Join the specific room for this order
        socket.emit('join_order_room', trackingId);
        console.log(`[3] Joined Socket Room: ${trackingId}`);

        // Listen for real-time status updates
        socket.on('order:status', (data) => {
            console.log(`✅ [Socket.IO Event Received] Status: ${data.status} | Message: ${data.message}`);
            if (data.status === 'READY') {
                console.log("🎉 Test Complete: Async pipeline successfully processed and broadcasted all states!");
                process.exit(0);
            }
        });

        console.log(`[4] Pushing Job to BullMQ OrderQueue...`);
        // Push job to the queue
        await orderQueue.add('process_order', {
            items: [{ foodItemId: 1, quantity: 2 }],
            restaurantId: 1,
            userId: 1, // Assume user ID 1 exists
            trackingId
        });
        console.log(`[5] Job Enqueued. Waiting for Background Worker to pick it up...`);
    });
};

runTest();
