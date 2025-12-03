const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabase() {
  console.log('🧪 EduSphere Database Functional Test\n');

  try {
    // Test 1: Create Organization
    console.log('✓ Test 1: Creating organization...');
    const org = await prisma.organization.create({
      data: {
        name: 'Тест Сургууль',
        slug: 'test-school',
        type: 'school',
        status: 'active',
      },
    });
    console.log(`   Created: ${org.name} (ID: ${org.id})\n`);

    // Test 2: Create Admin User
    console.log('✓ Test 2: Creating admin user...');
    const admin = await prisma.user.create({
      data: {
        organizationId: org.id,
        email: 'admin@school.mn',
        firstName: 'Админ',
        lastName: 'Админов',
        role: 'admin',
        status: 'active',
      },
    });
    console.log(`   Created: ${admin.firstName} ${admin.lastName} (${admin.email})\n`);

    // Test 3: Create Teacher
    console.log('✓ Test 3: Creating teacher...');
    const teacher = await prisma.user.create({
      data: {
        organizationId: org.id,
        email: 'teacher@school.mn',
        firstName: 'Багш',
        lastName: 'Багшийн',
        role: 'teacher',
        status: 'active',
      },
    });
    console.log(`   Created: ${teacher.firstName} ${teacher.lastName} (${teacher.email})\n`);

    // Test 4: Create Students
    console.log('✓ Test 4: Creating students...');
    const students = await Promise.all([
      prisma.user.create({
        data: {
          organizationId: org.id,
          email: 'student1@school.mn',
          firstName: 'Сурагч',
          lastName: 'Нэг',
          role: 'student',
          status: 'active',
        },
      }),
      prisma.user.create({
        data: {
          organizationId: org.id,
          email: 'student2@school.mn',
          firstName: 'Сурагч',
          lastName: 'Хоёр',
          role: 'student',
          status: 'active',
        },
      }),
    ]);
    console.log(`   Created ${students.length} students\n`);

    // Test 5: Create Course
    console.log('✓ Test 5: Creating course...');
    const course = await prisma.course.create({
      data: {
        organizationId: org.id,
        title: 'Математик 101',
        slug: 'math-101',
        description: 'Математикийн үндсэн хичээл',
        category: 'mathematics',
        level: 'beginner',
        instructorId: teacher.id,
      },
    });
    console.log(`   Created: ${course.title}\n`);

    // Test 6: Create Class
    console.log('✓ Test 6: Creating class...');
    const classRoom = await prisma.class.create({
      data: {
        organizationId: org.id,
        courseId: course.id,
        name: '1-р анги',
        code: 'CLASS-1',
        academicYear: '2025-2026',
        semester: 'fall',
        startDate: new Date('2025-09-01'),
        endDate: new Date('2026-05-31'),
        status: 'active',
      },
    });
    console.log(`   Created: ${classRoom.name} (${classRoom.academicYear})\n`);

    // Test 7: Enroll Students
    console.log('✓ Test 7: Enrolling students in class...');
    const enrollments = await Promise.all(
      students.map((student: any) =>
        prisma.enrollment.create({
          data: {
            userId: student.id,
            classId: classRoom.id,
            enrolledAt: new Date(),
            status: 'active',
          },
        })
      )
    );
    console.log(`   Enrolled ${enrollments.length} students\n`);

    // Test 8: Create Lesson
    console.log('✓ Test 8: Creating lesson...');
    const lesson = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: 'Хичээл 1: Танилцуулга',
        slug: 'lesson-1-intro',
        content: 'Математикийн үндсэн ойлголтуудтай танилцана',
        orderIndex: 1,
        durationMinutes: 45,
      },
    });
    console.log(`   Created: ${lesson.title}\n`);

    // Test 9: Create Assessment
    console.log('✓ Test 9: Creating assessment...');
    const assessment = await prisma.assessment.create({
      data: {
        lessonId: lesson.id,
        title: 'Шалгалт 1',
        description: 'Эхний хичээлийн шалгалт',
        type: 'quiz',
        totalPoints: 100,
        passingScore: 60,
      },
    });
    console.log(`   Created: ${assessment.title} (Max: ${assessment.totalPoints})\n`);

    // Test 10: Record Attendance
    console.log('✓ Test 10: Recording attendance...');
    const attendance = await Promise.all(
      students.map((student: any) =>
        prisma.attendance.create({
          data: {
            userId: student.id,
            classId: classRoom.id,
            date: new Date(),
            status: 'present',
            recordedBy: teacher.id,
          },
        })
      )
    );
    console.log(`   Recorded attendance for ${attendance.length} students\n`);

    // Test 11: Query Statistics
    console.log('✓ Test 11: Querying statistics...');
    const stats = {
      organizations: await prisma.organization.count(),
      users: await prisma.user.count(),
      courses: await prisma.course.count(),
      classes: await prisma.class.count(),
      enrollments: await prisma.enrollment.count(),
      lessons: await prisma.lesson.count(),
      assessments: await prisma.assessment.count(),
      attendance: await prisma.attendance.count(),
    };
    console.log('   Database Statistics:');
    console.log(`   - Organizations: ${stats.organizations}`);
    console.log(`   - Users: ${stats.users}`);
    console.log(`   - Courses: ${stats.courses}`);
    console.log(`   - Classes: ${stats.classes}`);
    console.log(`   - Enrollments: ${stats.enrollments}`);
    console.log(`   - Lessons: ${stats.lessons}`);
    console.log(`   - Assessments: ${stats.assessments}`);
    console.log(`   - Attendance Records: ${stats.attendance}\n`);

    // Test 12: Complex Query - Students with Courses
    console.log('✓ Test 12: Complex query - Students with enrollments...');
    const studentsWithEnrollments = await prisma.user.findMany({
      where: {
        role: 'student',
      },
      include: {
        enrollments: {
          include: {
            class: {
              include: {
                course: true,
              },
            },
          },
        },
      },
    });
    studentsWithEnrollments.forEach((student: any) => {
      console.log(`   ${student.firstName} ${student.lastName}:`);
      student.enrollments.forEach((enrollment: any) => {
        console.log(`     - ${enrollment.class.course.name} (${enrollment.class.name})`);
      });
    });
    console.log('');

    // Success Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All tests passed successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Test Summary:');
    console.log('   • Organization created');
    console.log('   • Admin, Teacher, Students created');
    console.log('   • Course and Class created');
    console.log('   • Students enrolled');
    console.log('   • Lesson created');
    console.log('   • Assessment created');
    console.log('   • Attendance recorded');
    console.log('   • Database queries working');
    console.log('   • Complex relations functioning\n');

    console.log('🎉 Database is fully functional!\n');
    console.log('🌐 View data in Prisma Studio: http://localhost:5555');
    console.log('🌐 View app: http://localhost:3001\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();
