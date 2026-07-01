import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');
  

  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.foodItem.deleteMany({});
  await prisma.hotelAdmin.deleteMany({});
  await prisma.restaurant.deleteMany({});
  await prisma.companyAdmin.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash('password123', 10);

  // 1. Create 1 Company Admin
  console.log('👤 Creating Company Admin...');
  await prisma.companyAdmin.create({
    data: {
      name: 'Global Admin',
      email: 'admin@voice2bite.com',
      password: defaultPassword,
      role: 'COMPANY_ADMIN',
    }
  });

  // 2. Create 20 Restaurants & Hotel Admins
  console.log('🍔 Creating 20 Restaurants & Hotel Admins...');
  const restaurants = [];
  const hotelAdmins = [];
  
  for (let i = 1; i <= 20; i++) {
    const restaurant = await prisma.restaurant.create({
      data: {
        name: faker.company.name() + ' Restaurant',
        latitude: faker.location.latitude({ min: 40.7, max: 40.8 }), // Mocking near a central point
        longitude: faker.location.longitude({ min: -74.05, max: -73.95 }),
        address: faker.location.streetAddress(),
        location: faker.location.city(),
        rating: faker.number.int({ min: 1, max: 5 }),
        hotelTags: [faker.food.adjective(), faker.food.ethnicCategory()],
        desc: faker.lorem.paragraph(),
        category: [faker.food.ethnicCategory()],
        photoUrl: faker.image.urlLoremFlickr({ category: 'food' }),
        phone: faker.phone.number(),
      }
    });
    restaurants.push(restaurant);

    // Create a Hotel Admin for this restaurant
    const email = i === 1 ? 'hotel@voice2bite.com' : faker.internet.email();
    const hotelAdmin = await prisma.hotelAdmin.create({
      data: {
        name: faker.person.fullName(),
        email: email,
        password: defaultPassword,
        role: 'HOTEL_ADMIN',
        restaurantId: restaurant.id
      }
    });
    hotelAdmins.push(hotelAdmin);
  }

  // 3. Create ~100 Food Items (5 per restaurant)
  console.log('🍕 Creating 100 Food Items...');
  const allFoodItems = [];
  for (let i = 0; i < restaurants.length; i++) {
    const restaurant = restaurants[i];
    const admin = hotelAdmins[i];
    
    for (let j = 0; j < 5; j++) {
      const foodItem = await prisma.foodItem.create({
        data: {
          name: faker.food.dish(),
          description: faker.food.description(),
          price: parseFloat(faker.commerce.price({ min: 5, max: 50, dec: 2 })),
          isAvailable: true,
          tags: [faker.food.adjective(), faker.food.ingredient()],
          photoUrl: faker.image.urlLoremFlickr({ category: 'food' }),
          restaurantId: restaurant.id,
          createdById: admin.id
        }
      });
      allFoodItems.push(foodItem);
    }
  }

  // 4. Create 50 Customers
  console.log('🧑‍🤝‍🧑 Creating 50 Customers...');
  const users = [];
  for (let i = 1; i <= 50; i++) {
    const email = i === 1 ? 'customer@voice2bite.com' : faker.internet.email();
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: email,
        password: defaultPassword,
        address: faker.location.streetAddress(),
        photoUrl: faker.image.avatar(),
        role: 'CUSTOMER'
      }
    });
    users.push(user);
  }

  // 5. Create 10 mock orders
  console.log('🛒 Creating 10 mock orders...');
  for (let i = 0; i < 10; i++) {
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomRestaurant = restaurants[Math.floor(Math.random() * restaurants.length)];
    const restaurantFoods = allFoodItems.filter(f => f.restaurantId === randomRestaurant.id);
    
    if (restaurantFoods.length > 0) {
      const foodItem = restaurantFoods[0];
      const qty = faker.number.int({ min: 1, max: 3 });
      
      await prisma.order.create({
        data: {
          userId: randomUser.id,
          restaurantId: randomRestaurant.id,
          totalAmount: foodItem.price * qty,
          status: 'DELIVERED',
          orderItems: {
            create: [{
              foodItemId: foodItem.id,
              quantity: qty
            }]
          }
        }
      });
    }
  }

  console.log('✅ Seeding completely finished!');
  console.log('----------------------------------------------------');
  console.log('TEST CREDENTIALS (All passwords are "password123"):');
  console.log('Company Admin: admin@voice2bite.com');
  console.log('Hotel Admin:   hotel@voice2bite.com');
  console.log('Customer:      customer@voice2bite.com');
  console.log('----------------------------------------------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
