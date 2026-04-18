# Slide Count Debugging Guide

## What We've Verified ✅

1. **Mock Generation Function** - Tested locally and confirmed WORKING:
   - `slideCount=1` → generates 1 slide ✅
   - `slideCount=2` → generates 2 slides ✅
   - `slideCount=3` → generates 3 slides ✅
   - `slideCount=5` → generates 5 slides ✅
   - `slideCount=8` → generates 8 slides ✅
   - `slideCount=12` → generates 12 slides ✅

2. **Parameter Passing** - All layers updated with explicit parsing:
   - Frontend: Sends `slideCount` as number via API
   - Backend Route: Parses with `parseInt(slideCount, 10)`
   - Mock.js: Parses with `parseInt(slideCount, 10)`
   - LLM.js: Parses with `parseInt(slideCount, 10)`

3. **Enhanced Logging** - Added detailed console logging at every step:
   - Backend route logs received slideCount and calculated numSlides
   - Mock.js logs received value, type, and parsed value
   - Mock.js logs exact slide count before and after generation
   - LLM.js logs parsed numSlides and slice operations

## How to Debug

### Step 1: Run Backend Tests (Local)
```bash
cd backend
node test-slidecount.js    # Tests mock function directly
```

### Step 2: Run API Tests (Backend Running)
Start backend server in another terminal:
```bash
npm run dev
```

Then in another terminal:
```bash
cd backend
node test-api.js           # Tests full API requests
```

### Step 3: Check Backend Console Logs
When you submit a carousel request from the UI, look for logs like:
```
========== CAROUSEL GENERATION START ==========
[GEN] Received slideCount from client: 1 Type: number
[GEN] Calculated numSlides: 1
[GEN] Generating carousel: prompt="...", tone=..., format=..., slideCount=1
[GEN] Using MOCK mode (or REAL LLM mode)
[MOCK] Received slideCount: 1 Type: number Parsed numSlides: 1
[MOCK] About to generate slides - numSlides: 1
[MOCK] Generated 1 slides
[GEN] ✅ Generated carousel with 1 slides
[GEN] Expected: 1 Got: 1
========== CAROUSEL GENERATION END ==========
```

## Possible Issues & Solutions

### Issue 1: Different Browser
- **Problem**: Browser cache might be showing old responses
- **Solution**: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Issue 2: MOCK vs Real LLM
- **Problem**: If using real LLM API, response might be truncated
- **Solution**: Check backend logs to see which mode is active
  - `MOCK mode` = Uses local generation (working ✅)
  - `REAL LLM mode` = Uses OpenRouter API (might have issues)

### Issue 3: LLM Response Parsing
- **Problem**: If OpenRouter API returns wrong number of slides
- **Solution**: Check if response is being properly parsed
  - LLM.js slices the response: `slides.slice(0, numSlides)`
  - If LLM returns 5 slides but you requested 1, it will slice to 1

### Issue 4: Frontend/LocalStorage
- **Problem**: Old carousel data cached in localStorage
- **Solution**: Clear localStorage
  ```javascript
  // In browser console
  localStorage.clear()
  ```

## What To Do Next

1. **Enable Backend Logging**: 
   - Terminal where backend is running
   - Look for the `========== CAROUSEL GENERATION START ==========` section
   - Copy the full logs and share them

2. **Select 1 Slide and Generate**:
   - Select 1 from the range slider
   - Submit the form
   - Check both:
     - Backend console logs
     - How many slides appear in the carousel viewer

3. **Share Results**:
   - How many slides did you select?
   - How many slides did you get?
   - What do the backend logs show?

## Files Modified for Debugging

- ✅ `/backend/utils/mock.js` - Added detailed logging
- ✅ `/backend/utils/llm.js` - Added detailed logging and parsing
- ✅ `/backend/routes/generate.js` - Added comprehensive logging
- ✅ `/backend/test-slidecount.js` - Direct function test (all passing)
- ✅ `/backend/test-api.js` - API integration test

## Quick Commands

```bash
# Terminal 1: Start backend
cd backend && npm run dev

# Terminal 2: Run local tests
cd backend && node test-slidecount.js

# Terminal 3: Test API (when backend is running)
cd backend && node test-api.js
```

---

**Note**: All code changes are backward compatible. The 1-12 slide range is fully implemented and the mock function is confirmed working. The issue may be isolated to a specific scenario.
