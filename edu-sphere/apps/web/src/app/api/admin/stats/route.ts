import { NextResponse } from 'next/server';
import { prisma } from '@edu-sphere/database';
import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Нэвтрээгүй байна' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as {
      userId: string;
      organizationId: string;
      role: string;
    };

    // Check if user is admin
    if (decoded.role !== 'ADMIN' && decoded.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Хандах эрхгүй байна' },
        { status: 403 }
      );
    }

    // Get stats for the organization
    const [users, courses, classes, students] = await Promise.all([
      prisma.user.count({
        where: { organizationId: decoded.organizationId },
      }),
      prisma.course.count({
        where: { organizationId: decoded.organizationId },
      }),
      prisma.class.count({
        where: {
          course: { organizationId: decoded.organizationId },
        },
      }),
      prisma.user.count({
        where: {
          organizationId: decoded.organizationId,
          role: 'STUDENT',
        },
      }),
    ]);

    return NextResponse.json({
      users,
      courses,
      classes,
      students,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { error: 'Серверийн алдаа гарлаа' },
      { status: 500 }
    );
  }
}
