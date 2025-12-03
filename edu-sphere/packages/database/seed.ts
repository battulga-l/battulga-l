const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('🌱 Seeding EduSphere Database with demo accounts\n');

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash('password', 10);

    // Create Organization
    console.log('✓ Creating organization...');
    const org = await prisma.organization.create({
      data: {
        name: 'Demo School',
        slug: 'demo-school',
        type: 'SCHOOL',
        status: 'ACTIVE',
      },
    });
    console.log(`   Created: ${org.name}\n`);

    // Create Admin User
    console.log('✓ Creating admin user...');
    const admin = await prisma.user.create({
      data: {
        organizationId: org.id,
        email: 'admin@test.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        status: 'ACTIVE',
      },
    });
    console.log(`   ✅ Admin: admin@test.com / password\n`);

    // Create Teacher
    console.log('✓ Creating teacher user...');
    const teacher = await prisma.user.create({
      data: {
        organizationId: org.id,
        email: 'teacher@test.com',
        password: hashedPassword,
        firstName: 'Teacher',
        lastName: 'User',
        role: 'TEACHER',
        status: 'ACTIVE',
      },
    });
    console.log(`   ✅ Teacher: teacher@test.com / password\n`);

    // Create Student
    console.log('✓ Creating student user...');
    const student = await prisma.user.create({
      data: {
        organizationId: org.id,
        email: 'student@test.com',
        password: hashedPassword,
        firstName: 'Student',
        lastName: 'User',
        role: 'STUDENT',
        status: 'ACTIVE',
      },
    });
    console.log(`   ✅ Student: student@test.com / password\n`);

    // Create Parent
    console.log('✓ Creating parent user...');
    const parent = await prisma.user.create({
      data: {
        organizationId: org.id,
        email: 'parent@test.com',
        password: hashedPassword,
        firstName: 'Parent',
        lastName: 'User',
        role: 'PARENT',
        status: 'ACTIVE',
      },
    });
    console.log(`   ✅ Parent: parent@test.com / password\n`);

    console.log('🎉 Database seeded successfully!\n');
    console.log('📋 Demo Accounts:');
    console.log('   • Admin:   admin@test.com / password');
    console.log('   • Teacher: teacher@test.com / password');
    console.log('   • Student: student@test.com / password');
    console.log('   • Parent:  parent@test.com / password\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
