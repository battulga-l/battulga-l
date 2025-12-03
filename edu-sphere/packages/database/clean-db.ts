const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('🧹 Cleaning database...\n');
  
  try {
    // Delete in correct order (respecting foreign keys)
    await prisma.submission.deleteMany();
    await prisma.attendance.deleteMany();
    await prisma.assessment.deleteMany();
    await prisma.lesson.deleteMany();
    await prisma.enrollment.deleteMany();
    await prisma.class.deleteMany();
    await prisma.course.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();
    
    console.log('✅ Database cleaned successfully!\n');
  } catch (error) {
    console.error('❌ Error cleaning database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
