
// src/i18n.ts
import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // This will be logged if the file is found and executed by next-intl
  console.log(`[i18n-DEBUG] src/i18n.ts getRequestConfig called for locale: ${locale}`);

  // Validate locale
  if (!['en', 'ar'].includes(locale as any)) {
    console.error(`[i18n-DEBUG] Invalid locale: ${locale}`);
    // Return a minimal structure for invalid locales to prevent further errors
    return {
      messages: {
        Error: {
          invalidLocale: "Invalid locale provided."
        }
      }
    };
  }

  // Provide static messages for testing
  // This helps isolate whether the issue is finding this file or loading messages from JSON
  if (locale === 'ar') {
    return {
      messages: {
        RootLayout: {
          pageTitle: "DebtVision (AR Static Test)",
          pageDescription: "إدارة ديونك برؤى مدعومة بالذكاء الاصطناعي (AR Static Test)."
        },
        LoginPage: { title: "تسجيل الدخول اختبار AR (ثابت)" },
        SignupPage: { title: "إنشاء حساب اختبار AR (ثابت)" },
        DashboardPage: { title: "لوحة التحكم اختبار AR (ثابت)" },
        DebtManagementPage: { title: "إدارة الديون اختبار AR (ثابت)", addNewDebtorButton: "إضافة مدين جديد (ثابت)" },
        AiAssistantPage: { title: "المساعد الذكي اختبار AR (ثابت)", description: "وصف ثابت للمساعد الذكي" },
        AppSidebar: { brandName: "DebtVision AR", dashboard: "لوحة التحكم", debtManagement: "إدارة الديون", aiAssistant: "المساعد الذكي", logout: "تسجيل الخروج" },
        AppHeader: { logout: "تسجيل الخروج AR", profile: "الملف الشخصي AR" },
        AuthContext: { loginSuccessTitle: "نجاح تسجيل الدخول AR", loginSuccessDescription: "جار التوجيه...", loginFailedTitle: "فشل", signupSuccessTitle: "نجاح إنشاء الحساب AR", signupSuccessDescription: "جار التوجيه...", signupFailedTitle: "فشل", passwordsDoNotMatch: "كلمات المرور غير متطابقة AR" },
        AppLayout: { loadingMessage: "جار تحميل الجلسة AR..." }
      }
    };
  }

  // Default to English
  return {
    messages: {
      RootLayout: {
        pageTitle: "DebtVision (EN Static Test)",
        pageDescription: "Manage your debts with AI-powered insights (EN Static Test)."
      },
      LoginPage: { title: "Login Test EN (Static)" , description: "Static desc", emailLabel: "Email", passwordLabel:"Password", loginButton:"Login", loadingLoginButton:"Logging in...", signupPrompt:"No account?", signupLink:"Sign up", brandName:"DebtVision"},
      SignupPage: { title: "Signup Test EN (Static)", description: "Static desc", emailLabel: "Email", passwordLabel:"Password", confirmPasswordLabel: "Confirm", signupButton:"Sign up", loadingSignupButton:"Signing up...", loginPrompt:"Have account?", loginLink:"Login", brandName:"DebtVision"},
      DashboardPage: { title: "Dashboard Test EN (Static)" },
      DebtManagementPage: { title: "Debt Management Test EN (Static)", addNewDebtorButton: "Add Debtor (Static)" },
      AiAssistantPage: { title: "AI Assistant Test EN (Static)", description: "Static AI desc" },
      AppSidebar: { brandName: "DebtVision EN", dashboard: "Dashboard", debtManagement: "Debt Management", aiAssistant: "AI Assistant", logout: "Logout" },
      AppHeader: { logout: "Log out EN", profile: "Profile EN" },
      AuthContext: { loginSuccessTitle: "Login Success EN", loginSuccessDescription: "Redirecting...", loginFailedTitle: "Failed", signupSuccessTitle: "Signup Success EN", signupSuccessDescription: "Redirecting...", signupFailedTitle: "Failed", passwordsDoNotMatch: "Passwords do not match EN" },
      AppLayout: { loadingMessage: "Loading session EN..." }
    }
  };
});
