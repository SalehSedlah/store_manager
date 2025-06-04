
// /src/i18n.ts
import {getRequestConfig} from 'next-intl/server';
// import {notFound} from 'next-intl'; // Keep commented for now

// const locales = ['en', 'ar']; // Not strictly needed here if middleware defines it

export default getRequestConfig(({locale}) => {
  // THIS IS THE MOST IMPORTANT LOG.
  console.log(`[ULTRA-DEBUG] SRC/I18N.TS /i18n.ts IS BEING EXECUTED. Locale: ${locale}`);

  // Provide all expected top-level namespaces and a few keys.
  // Using static messages to rule out dynamic import issues.
  // This is a simplified version. For a real app, you'd load these from JSON.
  let messages;
  if (locale === 'en') {
    messages = {
      App: { name: "DebtVision" },
      Sidebar: { dashboard: "Dashboard", debtManagement: "Debt Management", aiAssistant: "AI Assistant", logout: "Logout" },
      LoginPage: { title: "Login", description: "Access your DebtVision account", emailLabel: "Email", emailPlaceholder: "you@example.com", passwordLabel: "Password", loginButton: "Login", loadingLoginButton: "Logging in...", signupPrompt: "Don't have an account?", signupLink: "Sign up" },
      SignupPage: { title: "Create Account", description: "Join DebtVision today", emailLabel: "Email", emailPlaceholder: "you@example.com", passwordLabel: "Password", confirmPasswordLabel: "Confirm Password", signupButton: "Sign Up", loadingSignupButton: "Creating account...", loginPrompt: "Already have an account?", loginLink: "Login" },
      DashboardPage: { title: "Dashboard", totalDebt: "Total Debt", totalDebtDescription: "{utilization}% of credit limits utilized", totalDebtors: "Total Debtors", totalDebtorsDescription: "Active debtors being tracked", avgDebtPerDebtor: "Avg. Debt per Debtor", avgDebtPerDebtorDescription: "Average amount owed", debtorsOverLimit: "Debtors Over Limit", debtorsOverLimitDescription: "Exceeding credit limits", aiDebtOverviewTitle: "AI Debt Overview", aiDebtOverviewDescription: "Insights and recommendations based on your current debt portfolio.", refreshSummaryButton: "Refresh Summary", refreshingSummaryButton: "Refreshing...", aiSummary: { summaryTitle: "Summary", riskAssessmentTitle: "Risk Assessment", recommendationsTitle: "Recommendations", noDataSummary: "No debtor data available to generate a summary.", noDataRisk: "N/A", noDataRecommendations: "Add debtor information to get an AI-powered summary and recommendations.", errorSummary: "Error generating AI summary.", errorRisk: "Could not assess risk.", errorRecommendations: "Please try again later." } },
      DebtManagementPage: { title: "Debt Management", addNewDebtorButton: "Add New Debtor" },
      AiAssistantPage: { title: "AI Assistant", description: "Leverage AI to gain insights and make better financial decisions." },
      DebtorForm: { addTitle: "Add New Debtor", addDescription: "Enter the details for the new debtor.", editTitle: "Edit Debtor", editDescription: "Update the details for this debtor.", nameLabel: "Name", namePlaceholder: "John Doe", amountOwedLabel: "Amount Owed ($)", creditLimitLabel: "Credit Limit ($)", paymentHistoryLabel: "Payment History", paymentHistoryPlaceholder: "e.g., Consistently pays on time.", cancelButton: "Cancel", addButton: "Add Debtor", saveButton: "Save Changes", savingButton: "Saving..." },
      DebtorList: { noDebtors: "No debtors found. Add a new debtor to get started.", nameHeader: "Name", amountOwedHeader: "Amount Owed", creditLimitHeader: "Credit Limit", statusHeader: "Status", lastUpdatedHeader: "Last Updated", actionsHeader: "Actions", statusOverLimit: "Over Limit", statusWithinLimit: "Within Limit", editAction: "Edit", deleteAction: "Delete", deleteDialogTitle: "Are you sure?", deleteDialogDescription: "This action cannot be undone. This will permanently delete {name}'s record.", deleteDialogCancel: "Cancel", deleteDialogConfirm: "Delete" },
      RiskAssessmentForm: { title: "Debtor Risk Assessment", description: "Analyze a debtor's risk profile using AI.", selectDebtorLabel: "Select Debtor (Optional)", selectDebtorPlaceholder: "Select a debtor or enter manually", selectDebtorManualOption: "Enter Manually", selectDebtorDescription: "Select an existing debtor to pre-fill some fields, or choose \"Enter Manually\".", paymentBehaviorLabel: "Payment Behavior", paymentBehaviorPlaceholder: "e.g., Consistently pays on time, occasional late payments...", debtAmountLabel: "Debt Amount ($)", creditLimitLabel: "Credit Limit ($) (Optional)", creditScoreLabel: "Credit Score (Optional)", creditScorePlaceholder: "300-850", assessRiskButton: "Assess Risk", assessingRiskButton: "Assessing Risk...", resultTitle: "Assessment Result:", riskLevelLabel: "Risk Level:", riskFactorsLabel: "Risk Factors:", suggestedActionsLabel: "Suggested Actions:" },
      CreditSuggestionTool: { title: "Credit Limit Suggestions", description: "Let AI suggest optimal credit limits for your debtors based on their data.", generateButton: "Generate Suggestions for All Debtors", generatingButton: "Generating Suggestions...", loadingDebtorsButton: "Loading Debtors...", suggestedLimitsTitle: "Suggested Limits:", debtorNameHeader: "Debtor Name", suggestedLimitHeader: "Suggested Limit", reasoningHeader: "Reasoning", noSuggestionsPlaceholder: "Click the button above to generate credit limit suggestions.", noDebtorsPlaceholder: "Please add debtors in the Debt Management section to get suggestions." },
      Toast: { loginSuccessTitle: "Login Successful", loginSuccessDescription: "Redirecting to dashboard...", loginFailedTitle: "Login Failed", signupSuccessTitle: "Signup Successful", signupSuccessDescription: "Redirecting to dashboard...", signupFailedTitle: "Signup Failed", logoutSuccessTitle: "Logged Out", logoutSuccessDescription: "You have been successfully logged out.", logoutFailedTitle: "Logout Failed", debtorAddedTitle: "Debtor Added", debtorAddedDescription: "{name} has been added.", debtorUpdatedTitle: "Debtor Updated", debtorUpdatedDescription: "{name} has been updated.", debtorDeletedTitle: "Debtor Deleted", debtorDeletedDescription: "{name} has been deleted.", errorTitle: "Error", riskAssessmentCompleteTitle: "Risk Assessment Complete", riskAssessmentCompleteDescription: "AI analysis finished.", riskAssessmentFailedTitle: "Assessment Failed", creditSuggestionsReadyTitle: "Suggestions Ready", creditSuggestionsReadyDescription: "AI has generated credit limit suggestions.", creditSuggestionFailedTitle: "Suggestion Failed", noDebtorsForCreditSuggestionTitle: "No Debtors", noDebtorsForCreditSuggestionDescription: "Add debtors to get credit limit suggestions." },
      AuthGuard: { loadingSession: "Loading user session..." },
      AppHeader: { userAvatarHint: "user avatar", userInitialsFallback: "DV" }
    };
  } else if (locale === 'ar') {
    messages = {
      App: { name: "DebtVision (AR)" },
      Sidebar: { dashboard: "لوحة التحكم", debtManagement: "إدارة الديون", aiAssistant: "مساعد الذكاء الاصطناعي", logout: "تسجيل الخروج" },
      LoginPage: { title: "تسجيل الدخول", description: "الوصول إلى حساب DebtVision الخاص بك", emailLabel: "البريد الإلكتروني", emailPlaceholder: "you@example.com", passwordLabel: "كلمة المرور", loginButton: "تسجيل الدخول", loadingLoginButton: "جاري تسجيل الدخول...", signupPrompt: "ليس لديك حساب؟", signupLink: "إنشاء حساب" },
      SignupPage: { title: "إنشاء حساب", description: "انضم إلى DebtVision اليوم", emailLabel: "البريد الإلكتروني", emailPlaceholder: "you@example.com", passwordLabel: "كلمة المرور", confirmPasswordLabel: "تأكيد كلمة المرور", signupButton: "إنشاء حساب", loadingSignupButton: "جاري إنشاء الحساب...", loginPrompt: "هل لديك حساب بالفعل؟", loginLink: "تسجيل الدخول" },
      AuthGuard: { loadingSession: "جاري تحميل جلسة المستخدم..." },
      AppHeader: { userAvatarHint: "صورة المستخدم الرمزية", userInitialsFallback: "مستخدم" }
      // ... add all other namespaces and keys for AR as in en.json
    };
  } else {
    // Fallback for unhandled locales, though middleware should prevent this.
    console.warn(`[ULTRA-DEBUG] No static messages defined for locale: ${locale}. Defaulting to English.`);
    messages = { App: { name: "DebtVision (Fallback/EN)" }, Sidebar: { dashboard: "Dashboard (Fallback/EN)" } };
  }

  return {
    messages
  };
});
