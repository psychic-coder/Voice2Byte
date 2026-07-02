import { Worker } from 'bullmq';
import Redis from 'ioredis';
import prisma from '../prisma/client.js';
import { getIO } from '../lib/socket.js';

const connection = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
});

export const initWorker = () => {
  const worker = new Worker('OrderQueue', async (job) => {
    const { items, restaurantId, userId, trackingId } = job.data;
    const io = getIO();
    
    console.log(`[OrderWorker] Starting job ${job.id} for trackingId: ${trackingId}`);

    // Fetch prices to calculate total
    const foodItems = await prisma.foodItem.findMany({
      where: { id: { in: items.map(item => item.foodItemId) } },
      select: { id: true, price: true }
    });

    const priceMap = foodItems.reduce((map, item) => (map[item.id] = item.price, map), {});
    const totalAmount = items.reduce((total, item) => 
      total + (priceMap[item.foodItemId] * item.quantity), 0);

    // Save actual order to DB
    const order = await prisma.order.create({
      data: {
        userId,
        restaurantId,
        totalAmount,
        orderItems: {
          create: items.map(item => ({
            foodItemId: item.foodItemId,
            quantity: item.quantity
          }))
        }
      }
    });

    io.to(trackingId).emit('order:status', { 
      status: 'RECEIVED', 
      message: 'Order received by the kitchen' 
    });
    io.to(`restaurant_${restaurantId}`).emit('admin:order_update', {
      orderId: order.id,
      trackingId,
      status: 'RECEIVED',
      message: 'New order received'
    });

    // Simulate preparation time
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    io.to(trackingId).emit('order:status', { 
      status: 'PREPARING', 
      message: 'Your order is currently being prepared' 
    });

    // Simulate completion time
    await new Promise(resolve => setTimeout(resolve, 5000));

    io.to(trackingId).emit('order:status', { 
      status: 'READY', 
      message: 'Your order is now ready for pickup' 
    });

    console.log(`[OrderWorker] Completed job ${job.id} for trackingId: ${trackingId}`);
    return order;

  }, { connection });

  worker.on('failed', (job, err) => {
    console.error(`[OrderWorker] Job ${job.id} failed with error ${err.message}`);
  });

  return worker;
};
