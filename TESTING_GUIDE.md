# Testing Guide: Authentication Feature

## Quick Start

### Prerequisites
- Backend API running on http://localhost:3000
- Backend endpoints ready:
  - `POST /api/auth/register`
  - `POST /api/auth/login`

### Starting the Dev Server

```bash
npm install  # If dependencies not installed
npm run dev
```

Visit: http://localhost:5173

---

## Test Scenarios

### Scenario 1: Successful Registration

**Steps:**
1. Open http://localhost:5173 (should redirect to /login)
2. Click "Create Account" link
3. Fill the form:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
   - Check "I agree to the Terms & Conditions"
4. Click "Create Account" button

**Expected Results:**
- Button shows loading spinner
- After API response: "Account created successfully!" message appears
- Form clears
- After 2 seconds: redirects to /login page

**Verification:**
- Open Developer Tools → Network tab
- Check POST request to `/api/auth/register`
- Request body should contain: name, email, password
- Response status: 200 OK
- Response has data with token

---

### Scenario 2: Registration - Validation Errors

**Test 2.1: Empty Form**
1. Navigate to /register
2. Click "Create Account" without filling anything
3. Expected: Error messages appear below each field

**Test 2.2: Name Too Short**
1. Name: `Jo`
2. Expected: Error "Name must be at least 3 characters"

**Test 2.3: Invalid Email**
1. Email: `invalid.email`
2. Expected: Error "Please enter a valid email address"

**Test 2.4: Password Too Short**
1. Password: `123`
2. Expected: Error "Password must be at least 6 characters"

**Test 2.5: Password Mismatch**
1. Password: `password123`
2. Confirm Password: `password124`
3. Expected: Error "Passwords do not match"

**Test 2.6: Terms Not Agreed**
1. Fill all fields correctly
2. Don't check "I agree to the Terms & Conditions"
3. Click Create Account
4. Expected: Error "Please fix the errors above"

---

### Scenario 3: Registration - Server Errors

**Test 3.1: Email Already Registered**
1. Register with an email that already exists
2. Expected: Server returns error message
3. Error message displays in red at top of form

**Test 3.2: Network Error**
1. Stop the backend server
2. Try to register
3. Expected: "Network error. Please check your internet connection." message

---

### Scenario 4: Successful Login

**Steps:**
1. Navigate to http://localhost:5173/login
2. Fill the form:
   - Email: `john@example.com` (from previous registration)
   - Password: `password123`
3. Click "Login" button

**Expected Results:**
- Button shows loading spinner
- After API response: redirects to /dashboard
- Token is saved in localStorage

**Verification:**
- Open Developer Tools → Application tab
- Check localStorage for key `ujian_token`
- Value should be the JWT token from response
- Network tab shows POST to `/api/auth/login`

---

### Scenario 5: Login - Validation Errors

**Test 5.1: Empty Form**
1. Click Login without filling
2. Expected: Error messages appear below fields

**Test 5.2: Empty Email**
1. Password: `password123`
2. Click Login
3. Expected: "Email is required" error

**Test 5.3: Empty Password**
1. Email: `john@example.com`
2. Click Login
3. Expected: "Password is required" error

---

### Scenario 6: Login - Invalid Credentials

1. Email: `john@example.com`
2. Password: `wrongpassword`
3. Click Login
4. Expected: Server error message (e.g., "Invalid email or password")

---

### Scenario 7: UI/UX Features

**Test 7.1: Password Visibility Toggle**
1. Click the eye icon next to password field
2. Expected: Password becomes visible
3. Click again: Password becomes hidden

**Test 7.2: Form Responsiveness**
1. Open in mobile device or resize browser to 375px
2. Expected: Form stacks properly, readable on small screens
3. No overflow, proper padding

**Test 7.3: Loading State**
1. Start registration/login
2. Button should be disabled (opacity 50%)
3. Spinner should be visible
4. Cannot click button again

**Test 7.4: Error Message Styling**
1. Trigger validation error
2. Expected: Red border on input field
3. Red error text below field

**Test 7.5: Success Message Styling**
1. Successful registration
2. Expected: Green background message
3. "✓" checkmark visible
4. Clear message text

---

## Debugging Tips

### Check Console
Open Developer Tools → Console tab:
- Should see no red error messages
- Check for any warnings

### Check Network Requests
1. Open Developer Tools → Network tab
2. Perform login/register
3. Look for `/api/auth/register` or `/api/auth/login` requests
4. Click request → check Request/Response tabs
5. Verify request body and response status

### Check localStorage
1. Open Developer Tools → Application tab
2. Look for `ujian_token` key
3. Value should be a JWT token (starts with `eyJ`)

### Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge

---

## Common Issues & Solutions

### Issue: "Network error" message
**Solution:** 
- Check if backend is running on http://localhost:3000
- Check CORS configuration on backend
- Check browser console for detailed error

### Issue: Form not submitting
**Solution:**
- Check browser console for JavaScript errors
- Verify all validation passes (no red error messages)
- Check if button is disabled during loading

### Issue: Token not stored
**Solution:**
- Check if API returns token in response
- Check if response.data.token exists
- Open localStorage in DevTools

### Issue: Redirect not happening
**Solution:**
- Check if API response has success: true
- Verify router.push() is called
- Check browser console for errors

### Issue: Styling looks wrong
**Solution:**
- Clear browser cache
- Refresh page (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac)
- Check if Tailwind CSS is loaded

---

## Test Data

### Valid Registration Data
```
Name: Test User
Email: test@example.com
Password: Test123456
```

### Valid Login Data
```
Email: test@example.com
Password: Test123456
```

---

## Performance Checks

### Load Time
- Register page should load < 2 seconds
- Form should be interactive immediately

### API Response Time
- Registration: should complete within 3-5 seconds
- Login: should complete within 3-5 seconds

### Bundle Size
- JavaScript: ~162.50 kB (gzipped: ~59.23 kB)
- CSS: ~35.80 kB (gzipped: ~7.08 kB)

---

## Checklist for Testing

### Before Testing
- [ ] Backend API is running
- [ ] Dev server is running on localhost:5173
- [ ] Browser console is open
- [ ] Network tab is open

### During Testing
- [ ] Follow all scenarios
- [ ] Note any errors
- [ ] Check both request and response
- [ ] Verify UI state changes

### After Testing
- [ ] Document any issues found
- [ ] Note API response format if different from spec
- [ ] Verify all test scenarios passed

---

## Next Steps

If all tests pass:
1. ✅ Feature is ready for deployment
2. ✅ Update backend if response format differs
3. ✅ Deploy to production environment

If issues found:
1. ⚠️ Document the issue
2. ⚠️ Check error message in console/Network tab
3. ⚠️ Verify backend API implementation
4. ⚠️ Contact development team

---

**Last Updated:** 2026-05-17  
**Feature Status:** Ready for Testing
