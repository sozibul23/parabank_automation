# ParaBank Test Automation Framework

Comprehensive Playwright + TypeScript test automation framework for [ParaBank Online Banking](https://parabank.parasoft.com/parabank/index.htm) application adhering to the **Page Object Model (POM)** design pattern with **Data-Driven Testing** and **CI/CD Integration**.

---

## 🚀 Key Highlights & Architecture
- **Page Object Model (POM)**: Complete decoupling of test logic from UI locators and interactions across 7 dedicated page objects.
- **Dynamic User Creation**: `utils/testHelper.ts` isolates each test scenario with dynamic user credentials, avoiding cross-test state pollution.
- **Data-Driven Testing**: External JSON test fixtures in `data/` for loan limits and customer profile modifications.
- **CI/CD Ready**: Automated workflow via GitHub Actions (`.github/workflows/playwright.yml`) running on push and PR.

---

## 📁 Repository Structure
```
parabank_automation/
├── .github/
│   └── workflows/
│       └── playwright.yml         # GitHub Actions CI pipeline
├── data/
│   ├── loanData.json              # Data-driven inputs for loan requests
│   └── profileData.json           # Data-driven inputs for profile updates
├── pages/
│   ├── BasePage.ts                # Shared base page methods
│   ├── LoginPage.ts               # Login form & authentication actions
│   ├── RegisterPage.ts            # Dynamic registration actions
│   ├── AccountsOverviewPage.ts    # Accounts table and balance assertions
│   ├── OpenAccountPage.ts         # Checking & Savings account creation
│   ├── TransferFundsPage.ts       # AJAX-synced fund transfer operations
│   ├── BillPayPage.ts             # Payee details & bill payments
│   ├── RequestLoanPage.ts         # Loan applications & status verification
│   ├── UpdateProfilePage.ts       # Contact info update form
│   └── FindTransactionsPage.ts    # Transaction search by ID, Date, Amount
├── tests/
│   ├── 01-registration.spec.ts    # User registration (positive & negative)
│   ├── 02-login-and-accounts.spec.ts # Authentication & Session flows
│   ├── 03-open-account.spec.ts    # Opening Checking/Savings accounts
│   ├── 04-transfer-funds.spec.ts  # Fund transfers between accounts
│   ├── 05-bill-pay.spec.ts        # Bill payment execution & mismatch error
│   ├── 06-request-loan.spec.ts    # Loan request processing & approval
│   ├── 07-update-profile.spec.ts  # Customer profile information update
│   └── 08-find-transactions.spec.ts # Transaction lookup by amount
├── utils/
│   └── testHelper.ts              # Dynamic data & registration utilities
├── playwright.config.ts           # Playwright configuration
├── package.json
└── tsconfig.json
```

---

## 🧪 Test Suites Coverage
| Suite | File | Scenarios Covered |
| :--- | :--- | :--- |
| **Registration** | `01-registration.spec.ts` | Dynamic customer registration, empty field validation errors |
| **Authentication** | `02-login-and-accounts.spec.ts` | Invalid credential rejection, complete login/logout cycle |
| **Open Account** | `03-open-account.spec.ts` | Open new Savings account, verify in Accounts Overview table |
| **Transfer Funds** | `04-transfer-funds.spec.ts` | Transfer funds across user accounts, verify confirmation |
| **Bill Payment** | `05-bill-pay.spec.ts` | Submit utility bill payment, verify mismatch account number error |
| **Loan Application** | `06-request-loan.spec.ts` | Apply for loan with external JSON data, verify status |
| **Update Profile** | `07-update-profile.spec.ts` | Update address/phone numbers, assert confirmation |
| **Find Transactions** | `08-find-transactions.spec.ts` | Search transactions by amount, assert transaction table |
| **Critical Flows & Security** | `09-critical-banking-flows.spec.ts` | Duplicate username rejection, password mismatch, ledger transfer verification, session logout invalidation, unauthorized route protection |

---

## 📋 Running Tests

```bash
# Run all 9 test suites
npm test

# Run critical security & financial flows
npx playwright test tests/09-critical-banking-flows.spec.ts
npm test

# Run tests in headed browser mode
npm run test:headed

# Run interactive Playwright UI runner
npm run test:ui

# Run a specific test suite
npx playwright test tests/04-transfer-funds.spec.ts

# View HTML Test Report
npm run report
```
