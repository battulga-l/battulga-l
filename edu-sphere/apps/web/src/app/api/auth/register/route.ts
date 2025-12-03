import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@edu-sphere/database';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, role, organizationName } =
      await request.json();

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Бүх талбаруудыг бөглөнө үү' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Нууц үг 8-аас дээш тэмдэгт байх ёстой' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Энэ имэйл хаягаар бүртгэлтэй хэрэглэгч байна' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create or find organization
    let organizationId: string;

    if (role === 'ADMIN' && organizationName) {
      // Create new organization for admin
      const organization = await prisma.organization.create({
        data: {
          name: organizationName,
          slug: organizationName.toLowerCase().replace(/\s+/g, '-'),
          type: 'SCHOOL',
          status: 'ACTIVE',
        },
      });
      organizationId = organization.id;
    } else {
      // For non-admin users, find or create default organization
      let defaultOrg = await prisma.organization.findFirst({
        where: { name: 'Default Organization' },
      });

      if (!defaultOrg) {
        defaultOrg = await prisma.organization.create({
          data: {
            name: 'Default Organization',
            slug: 'default-organization',
            type: 'SCHOOL',
            status: 'ACTIVE',
          },
        });
      }
      organizationId = defaultOrg.id;
    }

    // Create user with hashed password
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role || 'STUDENT',
        status: 'ACTIVE',
        organizationId,
      },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Return user data
    return NextResponse.json(
      {
        message: 'Амжилттай бүртгэгдлээ',
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Серверийн алдаа гарлаа' },
      { status: 500 }
    );
  }
}
