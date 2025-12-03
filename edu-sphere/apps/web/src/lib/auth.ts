import { supabase } from './supabase';

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Бүртгүүлэх
export async function signUp(data: SignUpData) {
  const { email, password, firstName, lastName, role, organizationId } = data;

  // Supabase Auth бүртгэл
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    throw authError;
  }

  // Хэрэглэгчийн профайл үүсгэх
  if (authData.user) {
    const { error: profileError } = await supabase.from('users').insert({
      id: authData.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      role,
      organization_id: organizationId,
    });

    if (profileError) {
      throw profileError;
    }
  }

  return authData;
}

// Нэвтрэх
export async function signIn(data: SignInData) {
  const { email, password } = data;

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return authData;
}

// Гарах
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

// Одоогийн хэрэглэгч
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Хэрэглэгчийн профайл татах
  const { data: profile, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    throw error;
  }

  return { ...user, profile };
}

// Нууц үг сэргээх
export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) {
    throw error;
  }
}

// Нууц үг шинэчлэх
export async function updatePassword(newPassword: string) {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw error;
  }
}

// Session шалгах
export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

// Auth state өөрчлөлтийг сонсох
export function onAuthStateChange(
  callback: (event: string, session: any) => void
) {
  return supabase.auth.onAuthStateChange(callback);
}
