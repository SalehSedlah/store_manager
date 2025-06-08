// This file is intentionally left empty to effectively delete it.
// The middleware functionality has been moved to /middleware.ts in the project root.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // فقط اسمح للطلب بالمرور بدون تعديل
  return NextResponse.next();
}
