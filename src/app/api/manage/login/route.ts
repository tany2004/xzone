// src/app/api/manage/login/route.ts (опционально)
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import bcrypt from 'bcryptjs';
import { signToken } from '~/lib/auth';

export async function POST(request: Request) {
  try {
    const { login, password } = await request.json();
    
    const admin = await db.admin.findUnique({
      where: { login },
    });
    
    if (!admin) {
      return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 });
    }
    
    const isValid = await bcrypt.compare(password, admin.passwordHash);
    
    if (!isValid) {
      return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 });
    }
    
    const token = await signToken(admin.id);
    
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}