import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edu-sphere/database';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return null;

  try {
    const decoded = verify(token, JWT_SECRET) as { userId: string; role: string; organizationId: string };
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { organization: true },
    });
    return user;
  } catch {
    return null;
  }
}

// GET /api/classes - List classes
export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const courseId = searchParams.get('courseId') || '';

    const where = {
      organizationId: user.organizationId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { code: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status }),
      ...(courseId && { courseId }),
      deletedAt: null,
    };

    const [classes, total] = await Promise.all([
      prisma.class.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              instructor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
          _count: {
            select: {
              enrollments: true,
              attendances: true,
            },
          },
        },
      }),
      prisma.class.count({ where }),
    ]);

    return NextResponse.json({
      classes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/classes error:', error);
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
  }
}

// POST /api/classes - Create new class
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user || !['ADMIN', 'SUPER_ADMIN', 'TEACHER'].includes(user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const {
      courseId,
      name,
      code,
      academicYear,
      semester,
      startDate,
      endDate,
      schedule,
      maxStudents,
    } = body;

    // Validate required fields
    if (!courseId || !name) {
      return NextResponse.json(
        { error: 'Course ID and name are required' },
        { status: 400 }
      );
    }

    // Check if course exists and belongs to the same organization
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, organizationId: true },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.organizationId !== user.organizationId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const classItem = await prisma.class.create({
      data: {
        organizationId: user.organizationId,
        courseId,
        name,
        code,
        academicYear,
        semester,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        schedule,
        maxStudents,
        status: 'active',
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructor: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
            attendances: true,
          },
        },
      },
    });

    return NextResponse.json(classItem, { status: 201 });
  } catch (error) {
    console.error('POST /api/classes error:', error);
    return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
  }
}
