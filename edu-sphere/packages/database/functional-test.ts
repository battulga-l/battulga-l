const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function functionalTest() {
  console.log('🧪 EduSphere Functional Test\n');
  console.log('=' .repeat(60));

  try {
    // Clean up old test data first
    console.log('\n🧹 Cleaning up old test data...');
    await prisma.submission.deleteMany({});
    await prisma.attendance.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.assessment.deleteMany({});
    await prisma.lesson.deleteMany({});
    await prisma.enrollment.deleteMany({});
    await prisma.class.deleteMany({});
    await prisma.course.deleteMany({});
    console.log('   ✓ Cleaned up old test data');

    // Get demo organization and users
    const org = await prisma.organization.findFirst({
      where: { slug: 'demo-school' },
    });

    const admin = await prisma.user.findUnique({
      where: { email: 'admin@test.com' },
    });

    const teacher = await prisma.user.findUnique({
      where: { email: 'teacher@test.com' },
    });

    const student1 = await prisma.user.findUnique({
      where: { email: 'student@test.com' },
    });

    console.log('\n✓ Test 1: Verified demo organization and users');
    console.log(`   Organization: ${org.name}`);
    console.log(`   Admin: ${admin.email}`);
    console.log(`   Teacher: ${teacher.email}`);
    console.log(`   Student: ${student1.email}`);

    // Test 2: Create a Course
    console.log('\n✓ Test 2: Creating course...');
    const course = await prisma.course.create({
      data: {
        organizationId: org.id,
        title: 'Web Development Fundamentals',
        slug: 'web-dev-fundamentals',
        description: 'Learn HTML, CSS, JavaScript, and modern web frameworks',
        category: 'Programming',
        level: 'beginner',
        durationHours: 40,
        price: 0,
        isPublished: true,
        publishedAt: new Date(),
        instructorId: teacher.id,
      },
    });
    console.log(`   Created: ${course.title}`);

    // Test 3: Create a Class
    console.log('\n✓ Test 3: Creating class...');
    const classItem = await prisma.class.create({
      data: {
        organizationId: org.id,
        courseId: course.id,
        name: 'Web Dev - Spring 2025',
        code: 'WEB101',
        schedule: { days: ['Monday', 'Wednesday'], time: '10:00-12:00' },
        maxStudents: 30,
        startDate: new Date('2025-01-15'),
        endDate: new Date('2025-05-15'),
        status: 'active',
      },
    });
    console.log(`   Created: ${classItem.name}`);

    // Test 4: Enroll student
    console.log('\n✓ Test 4: Enrolling student...');
    await prisma.enrollment.create({
      data: {
        userId: student1.id,
        classId: classItem.id,
        enrolledAt: new Date(),
        status: 'active',
      },
    });
    console.log(`   Enrolled: ${student1.email} → ${classItem.name}`);

    // Test 5: Create Lessons
    console.log('\n✓ Test 5: Creating lessons...');
    const lesson1 = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: 'Introduction to HTML',
        slug: 'intro-to-html',
        description: 'Learn the basics of HTML markup',
        contentType: 'video',
        durationMinutes: 60,
        orderIndex: 1,
      },
    });

    const lesson2 = await prisma.lesson.create({
      data: {
        courseId: course.id,
        title: 'CSS Styling Basics',
        slug: 'css-basics',
        description: 'Style your web pages with CSS',
        contentType: 'video',
        durationMinutes: 90,
        orderIndex: 2,
      },
    });
    console.log(`   Created: ${lesson1.title}`);
    console.log(`   Created: ${lesson2.title}`);

    // Test 6: Create Assessment
    console.log('\n✓ Test 6: Creating assessment...');
    const assessment = await prisma.assessment.create({
      data: {
        lessonId: lesson1.id,
        title: 'HTML & CSS Quiz',
        description: 'Test your knowledge of HTML and CSS',
        type: 'quiz',
        totalPoints: 100,
        passingScore: 70,
        dueDate: new Date('2025-02-01'),
        isPublished: true,
      },
    });
    console.log(`   Created: ${assessment.title}`);

    // Test 7: Submit Assignment
    console.log('\n✓ Test 7: Creating submission...');
    const submission = await prisma.submission.create({
      data: {
        assessmentId: assessment.id,
        userId: student1.id,
        answers: { answer: 'HTML is a markup language...' },
        attemptNumber: 1,
      },
    });
    console.log(`   Submitted by: ${student1.email}`);

    // Test 8: Grade Submission
    console.log('\n✓ Test 8: Grading submission...');
    await prisma.submission.update({
      where: { id: submission.id },
      data: {
        score: 85,
        feedback: 'Good work! Keep it up.',
        gradedAt: new Date(),
        gradedBy: teacher.id,
      },
    });
    console.log(`   Graded: 85/100 by ${teacher.email}`);

    // Test 9: Record Attendance
    console.log('\n✓ Test 9: Recording attendance...');
    await prisma.attendance.create({
      data: {
        classId: classItem.id,
        userId: student1.id,
        date: new Date(),
        status: 'present',
        recordedBy: teacher.id,
      },
    });
    console.log(`   Recorded: ${student1.email} - PRESENT`);

    // Test 10: Create Notification
    console.log('\n✓ Test 10: Creating notification...');
    await prisma.notification.create({
      data: {
        organizationId: org.id,
        userId: student1.id,
        title: 'New Assignment Posted',
        message: 'Your teacher has posted a new assignment for Web Development',
        type: 'assignment',
        isRead: false,
      },
    });
    console.log(`   Sent to: ${student1.email}`);

    // Test 11: Query Statistics
    console.log('\n✓ Test 11: Querying statistics...');
    const stats = await Promise.all([
      prisma.user.count(),
      prisma.course.count(),
      prisma.class.count(),
      prisma.enrollment.count(),
      prisma.lesson.count(),
      prisma.assessment.count(),
      prisma.submission.count(),
      prisma.attendance.count(),
    ]);

    console.log(`   Total Users: ${stats[0]}`);
    console.log(`   Total Courses: ${stats[1]}`);
    console.log(`   Total Classes: ${stats[2]}`);
    console.log(`   Total Enrollments: ${stats[3]}`);
    console.log(`   Total Lessons: ${stats[4]}`);
    console.log(`   Total Assessments: ${stats[5]}`);
    console.log(`   Total Submissions: ${stats[6]}`);
    console.log(`   Total Attendance Records: ${stats[7]}`);

    // Test 12: Complex Query with Relations
    console.log('\n✓ Test 12: Testing complex queries with relations...');
    const studentsWithCourses = await prisma.user.findMany({
      where: {
        role: 'STUDENT',
        organizationId: org.id,
      },
      include: {
        enrollments: {
          include: {
            class: {
              include: {
                course: {
                  select: {
                    title: true,
                    instructor: {
                      select: {
                        firstName: true,
                        lastName: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log(`   Found ${studentsWithCourses.length} students with enrollments`);
    studentsWithCourses.forEach((student) => {
      console.log(`   - ${student.firstName} ${student.lastName}:`);
      student.enrollments.forEach((enr) => {
        const course = enr.class.course;
        const instructor = course.instructor;
        console.log(
          `     • ${course.title} (Teacher: ${instructor.firstName} ${instructor.lastName})`
        );
      });
    });

    console.log('\n' + '='.repeat(60));
    console.log('✅ All functional tests passed successfully!');
    console.log('🎉 Database is fully operational with complete CRUD operations!');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

functionalTest();
