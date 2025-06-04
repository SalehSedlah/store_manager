// /i18n.ts
import {getRequestConfig} from 'next-intl/server';
// import {notFound} from 'next-intl'; // Keep commented for now

const locales = ['en', 'ar'];

export default getRequestConfig(async ({locale}) => {
  // THIS IS THE MOST IMPORTANT LOG.
  console.log(`[ULTRA-DEBUG] ROOT /i18n.ts IS BEING EXECUTED. Locale: ${locale}`);

  let messages;
  // Comprehensive fallback messages to prevent crashes in useTranslations
  const defaultMessages = {
      App: { name: `DebtVision Fallback (${locale})` },
      Sidebar: { dashboard: `Dashboard Fallback (${locale})`, debtManagement: `Debt Mgmt Fallback (${locale})`, aiAssistant: `AI Assistant Fallback (${locale})`, logout: `Logout Fallback (${locale})` },
      LoginPage: { title: `Login Fallback (${locale})`, description: "Access (Fallback)", emailLabel: "Email (Fallback)", emailPlaceholder: "you@example.com (Fallback)", passwordLabel: "Password (Fallback)", loginButton: "Login (Fallback)", loadingLoginButton: "Logging in... (Fallback)", signupPrompt: "No account? (Fallback)", signupLink: "Sign up (Fallback)" },
      SignupPage: { title: "Create Account (Fallback)", description: "Join (Fallback)", emailLabel: "Email (Fallback)", emailPlaceholder: "you@example.com (Fallback)", passwordLabel: "Password (Fallback)", confirmPasswordLabel: "Confirm (Fallback)", signupButton: "Sign Up (Fallback)", loadingSignupButton: "Creating... (Fallback)", loginPrompt: "Have account? (Fallback)", loginLink: "Login (Fallback)" },
      DashboardPage: { title: "Dashboard (Fallback)", totalDebt: "Total Debt (Fallback)", totalDebtDescription: "{utilization}% utilized (Fallback)", totalDebtors: "Total Debtors (Fallback)", totalDebtorsDescription: "Active (Fallback)", avgDebtPerDebtor: "Avg. Debt (Fallback)", avgDebtPerDebtorDescription: "Avg amount (Fallback)", debtorsOverLimit: "Over Limit (Fallback)", debtorsOverLimitDescription: "Exceeding (Fallback)", aiDebtOverviewTitle: "AI Overview (Fallback)", aiDebtOverviewDescription: "Insights (Fallback)", refreshSummaryButton: "Refresh (Fallback)", refreshingSummaryButton: "Refreshing... (Fallback)", aiSummary: { summaryTitle: "Summary (Fallback)", riskAssessmentTitle: "Risk (Fallback)", recommendationsTitle: "Recommendations (Fallback)", noDataSummary: "No data (Fallback)", noDataRisk: "N/A (Fallback)", noDataRecommendations: "Add data (Fallback)", errorSummary: "Error summary (Fallback)", errorRisk: "Error risk (Fallback)", errorRecommendations: "Error recs (Fallback)" } },
      DebtManagementPage: { title: "Debt Mgmt (Fallback)", addNewDebtorButton: "Add Debtor (Fallback)" },
      AiAssistantPage: { title: "AI Assistant (Fallback)", description: "Leverage AI (Fallback)" },
      DebtorForm: { addTitle: "Add Debtor (Fallback)", addDescription: "Enter details (Fallback)", editTitle: "Edit Debtor (Fallback)", editDescription": "Update details (Fallback)", nameLabel: "Name (Fallback)", namePlaceholder: "John Doe (Fallback)", amountOwedLabel: "Amount Owed (Fallback)", creditLimitLabel: "Credit Limit (Fallback)", paymentHistoryLabel: "Payment History (Fallback)", paymentHistoryPlaceholder": "e.g. (Fallback)", cancelButton: "Cancel (Fallback)", addButton: "Add (Fallback)", saveButton: "Save (Fallback)", savingButton: "Saving... (Fallback)" },
      DebtorList: { noDebtors: "No debtors (Fallback)", nameHeader: "Name (Fallback)", amountOwedHeader": "Amount Owed (Fallback)", creditLimitHeader": "Credit Limit (Fallback)", statusHeader: "Status (Fallback)", lastUpdatedHeader": "Last Updated (Fallback)", actionsHeader: "Actions (Fallback)", statusOverLimit: "Over Limit (Fallback)", statusWithinLimit: "Within Limit (Fallback)", editAction: "Edit (Fallback)", deleteAction: "Delete (Fallback)", deleteDialogTitle": "Are you sure? (Fallback)", deleteDialogDescription": "Delete {name}? (Fallback)", deleteDialogCancel: "Cancel (Fallback)", deleteDialogConfirm": "Delete (Fallback)" },
      RiskAssessmentForm: { title: "Risk Assess (Fallback)", description: "Analyze (Fallback)", selectDebtorLabel: "Select Debtor (Fallback)", selectDebtorPlaceholder: "Select (Fallback)", selectDebtorManualOption: "Manual (Fallback)", selectDebtorDescription": "Select or manual (Fallback)", paymentBehaviorLabel: "Payment Behavior (Fallback)", paymentBehaviorPlaceholder": "e.g. (Fallback)", debtAmountLabel: "Debt Amount (Fallback)", creditLimitLabel": "Credit Limit (Fallback)", creditScoreLabel": "Credit Score (Fallback)", creditScorePlaceholder": "300-850 (Fallback)", assessRiskButton": "Assess (Fallback)", assessingRiskButton": "Assessing... (Fallback)", resultTitle: "Result: (Fallback)", riskLevelLabel": "Risk Level: (Fallback)", riskFactorsLabel": "Risk Factors: (Fallback)", suggestedActionsLabel": "Suggested Actions: (Fallback)" },
      CreditSuggestionTool: { title: "Credit Suggest (Fallback)", description: "Let AI suggest (Fallback)", generateButton": "Generate (Fallback)", generatingButton": "Generating... (Fallback)", loadingDebtorsButton": "Loading Debtors... (Fallback)", suggestedLimitsTitle": "Suggestions: (Fallback)", debtorNameHeader": "Debtor (Fallback)", suggestedLimitHeader": "Suggested (Fallback)", reasoningHeader": "Reasoning (Fallback)", noSuggestionsPlaceholder": "Click button (Fallback)", noDebtorsPlaceholder": "Add debtors (Fallback)" },
      Toast: { loginSuccessTitle: "Login OK (Fallback)", loginSuccessDescription: "Redirecting (Fallback)", loginFailedTitle: "Login Fail (Fallback)", signupSuccessTitle: "Signup OK (Fallback)", signupSuccessDescription: "Redirecting (Fallback)", signupFailedTitle: "Signup Fail (Fallback)", logoutSuccessTitle: "Logged Out (Fallback)", logoutSuccessDescription: "Logged out. (Fallback)", logoutFailedTitle: "Logout Fail (Fallback)", debtorAddedTitle: "Debtor Added (Fallback)", debtorAddedDescription": "{name} added. (Fallback)", debtorUpdatedTitle: "Debtor Updated (Fallback)", debtorUpdatedDescription": "{name} updated. (Fallback)", debtorDeletedTitle: "Debtor Deleted (Fallback)", debtorDeletedDescription": "{name} deleted. (Fallback)", errorTitle: "Error (Fallback)", riskAssessmentCompleteTitle": "Assess OK (Fallback)", riskAssessmentCompleteDescription": "AI done. (Fallback)", riskAssessmentFailedTitle: "Assess Fail (Fallback)", creditSuggestionsReadyTitle": "Suggest OK (Fallback)", creditSuggestionsReadyDescription": "AI suggests. (Fallback)", creditSuggestionFailedTitle: "Suggest Fail (Fallback)", noDebtorsForCreditSuggestionTitle": "No Debtors (Fallback)", noDebtorsForCreditSuggestionDescription": "Add debtors. (Fallback)" },
      AuthGuard: { loadingSession: "Loading session... (Fallback)" },
      AppHeader: { userAvatarHint": "avatar (Fallback)", userInitialsFallback": "DV (Fallback)" }
    };

  if (!locales.includes(locale)) {
    console.error(`[ULTRA-DEBUG] ROOT /i18n.ts: Locale "${locale}" is not supported. Using fallback messages.`);
    messages = defaultMessages;
  } else {
    try {
      // Path is relative to project root, messages are in src/messages/
      messages = (await import(`./src/messages/${locale}.json`)).default;
      console.log(`[ULTRA-DEBUG] ROOT /i18n.ts: Successfully loaded messages for ${locale} from ./src/messages/${locale}.json`);
    } catch (error) {
      console.error(`[ULTRA-DEBUG] ROOT /i18n.ts: Failed to load messages for locale ${locale} from ./src/messages/${locale}.json. Error: ${error}. Using fallback messages.`);
      messages = defaultMessages;
    }
  }

  return {
    messages
  };
});
