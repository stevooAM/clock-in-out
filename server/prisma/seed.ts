import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.auth.deleteMany();
  await prisma.userSchedule.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Existing data cleared');

  // Create users
  console.log('👥 Creating users...');
  const users = await Promise.all([
    prisma.user.create({
      data: {
        uid: 'user001',
        name: 'John Doe',
        key: 'NFC-KEY-001',
      },
    }),
    prisma.user.create({
      data: {
        uid: 'user002',
        name: 'Jane Smith',
        key: 'NFC-KEY-002',
      },
    }),
    prisma.user.create({
      data: {
        uid: 'user003',
        name: 'Bob Johnson',
        key: 'NFC-KEY-003',
      },
    }),
    prisma.user.create({
      data: {
        uid: 'user004',
        name: 'Alice Williams',
        key: 'NFC-KEY-004',
      },
    }),
    prisma.user.create({
      data: {
        uid: 'user005',
        name: 'Charlie Brown',
        key: null, // User without NFC key yet
      },
    }),
  ]);
  console.log(`✅ Created ${users.length} users`);

  // Create schedules for users
  console.log('📅 Creating user schedules...');
  const schedules = [];

  // Monday to Friday schedules for User 1 (Full time)
  for (let day = 0; day < 5; day++) {
    for (let hour = 0; hour < 8; hour++) {
      schedules.push(
        prisma.userSchedule.create({
          data: {
            userId: 'user001',
            day: String(day),
            hour: String(hour),
            room: 'Room 101',
          },
        })
      );
    }
  }

  // Monday to Friday schedules for User 2 (Full time)
  for (let day = 0; day < 5; day++) {
    for (let hour = 0; hour < 8; hour++) {
      schedules.push(
        prisma.userSchedule.create({
          data: {
            userId: 'user002',
            day: String(day),
            hour: String(hour),
            room: 'Room 102',
          },
        })
      );
    }
  }

  // Part-time schedule for User 3 (Mon, Wed, Fri - mornings)
  for (const day of [0, 2, 4]) {
    for (let hour = 0; hour < 4; hour++) {
      schedules.push(
        prisma.userSchedule.create({
          data: {
            userId: 'user003',
            day: String(day),
            hour: String(hour),
            room: 'Room 103',
          },
        })
      );
    }
  }

  // Part-time schedule for User 4 (Tue, Thu - afternoons)
  for (const day of [1, 3]) {
    for (let hour = 4; hour < 8; hour++) {
      schedules.push(
        prisma.userSchedule.create({
          data: {
            userId: 'user004',
            day: String(day),
            hour: String(hour),
            room: 'Room 104',
          },
        })
      );
    }
  }

  // Schedule for User 5
  for (let day = 0; day < 5; day++) {
    for (let hour = 0; hour < 8; hour++) {
      schedules.push(
        prisma.userSchedule.create({
          data: {
            userId: 'user005',
            day: String(day),
            hour: String(hour),
            room: 'Room 105',
          },
        })
      );
    }
  }

  await Promise.all(schedules);
  console.log(`✅ Created ${schedules.length} schedule entries`);

  // Create some sample auth records (clock-in/out history)
  console.log('🕐 Creating sample clock-in/out records...');
  
  const now = Math.floor(Date.now() / 1000);
  const oneHourAgo = now - 3600;
  const twoHoursAgo = now - 7200;
  const yesterday = now - 86400;

  await prisma.auth.createMany({
    data: [
      // Today's records
      {
        userId: 'user001',
        reader: 'input',
        timestamp: twoHoursAgo,
      },
      {
        userId: 'user002',
        reader: 'input',
        timestamp: oneHourAgo,
      },
      // Yesterday's records
      {
        userId: 'user001',
        reader: 'input',
        timestamp: yesterday - 28800, // 8 hours before yesterday
      },
      {
        userId: 'user001',
        reader: 'output',
        timestamp: yesterday, // Yesterday
      },
      {
        userId: 'user002',
        reader: 'input',
        timestamp: yesterday - 28800,
      },
      {
        userId: 'user002',
        reader: 'output',
        timestamp: yesterday,
      },
      {
        userId: 'user003',
        reader: 'input',
        timestamp: yesterday - 28800,
      },
      {
        userId: 'user003',
        reader: 'output',
        timestamp: yesterday - 14400, // 4 hours before yesterday
      },
    ],
  });
  console.log('✅ Created sample clock-in/out records');

  // Summary
  console.log('\n📊 Seed Summary:');
  console.log(`   Users: ${users.length}`);
  console.log(`   Schedules: ${schedules.length}`);
  console.log(`   Auth Records: 8`);
  console.log('\n✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

