# AI Itinerary Experience Design
**For: Orbito Travel Platform**  
**Goal: Generate itineraries → Drive affiliate tour bookings**  
**Principle: AI assists, doesn't confuse**

---

## 🎯 CORE USER JOURNEY

```
Homepage → AI Input → Itinerary Generation → Review/Edit → Book Tours → Confirmation
   ↓           ↓              ↓                  ↓            ↓            ↓
 Inspire    Capture       Show Value        Refine      Convert    Delight
```

---

## 1. IDEAL AI ITINERARY FLOW

### **Step 1: Discovery (Homepage)**
**Where:** Hero section of homepage  
**Goal:** Capture intent without friction

```
┌─────────────────────────────────────────┐
│  🌍 Where do you want to go?            │
│  ┌───────────────────────────────────┐  │
│  │ e.g., Paris for 5 days            │  │
│  └───────────────────────────────────┘  │
│  [Create My Itinerary] ✨               │
│                                         │
│  Or try: 🗼 Paris  🏖️ Bali  🗾 Tokyo    │
└─────────────────────────────────────────┘
```

**Microcopy:**
- Input placeholder: `"Where to? (e.g., Paris, 5 days, romantic)"`
- Button: `"Create My Itinerary"` (not "Generate" - sounds robotic)
- Subtext: `"Free • Takes 30 seconds • No signup required"`

**Why homepage?**
- Lowest friction entry point
- Immediate value demonstration
- Captures high-intent users
- SEO landing page optimization

---

### **Step 2: AI Processing (Transition)**
**Where:** Modal overlay or dedicated page  
**Goal:** Set expectations, build anticipation

```
┌─────────────────────────────────────────┐
│         ✨ Creating Your Paris Trip      │
│                                         │
│  [████████░░] 80%                       │
│                                         │
│  ✓ Finding top attractions              │
│  ✓ Optimizing daily routes              │
│  → Matching bookable tours              │
│    Adding local recommendations         │
│                                         │
│  "Hang tight! We're planning the        │
│   perfect 5 days in Paris..."           │
└─────────────────────────────────────────┘
```

**Microcopy:**
- Title: `"Creating Your [Destination] Trip"` (personalized)
- Progress steps:
  - `"Finding top attractions"`
  - `"Optimizing daily routes"`
  - `"Matching bookable tours"` ← Key for monetization
  - `"Adding local recommendations"`
- Loading message: `"Hang tight! We're planning the perfect [X] days in [City]..."`

**Duration:** 10-15 seconds (real or artificial delay for perceived value)

---

### **Step 3: Itinerary Reveal (Dedicated Page)**
**Where:** `/plan` or `/itinerary/[id]`  
**Goal:** Show value, enable editing, drive bookings

```
┌─────────────────────────────────────────────────────────┐
│  ← Back    Your Paris Adventure                  Save   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📍 Paris • 5 Days • Feb 24-28, 2026                   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 💡 AI Tip: Your itinerary includes 3 bookable  │   │
│  │    tours. Book now to save 15% vs. walk-up.    │   │
│  │    [View Bookable Tours →]                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Day 1 - Tuesday, Feb 24                               │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🗼 Eiffel Tower Visit                           │   │
│  │ 9:00 AM • 2 hours • €25                         │   │
│  │                                                  │   │
│  │ ⭐ Book Skip-the-Line Tour                      │   │
│  │ Save 2 hours wait time • €52                    │   │
│  │ [Book Now] [Learn More]                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [+ Add Activity] [✏️ Edit Day] [🤖 Ask AI]            │
└─────────────────────────────────────────────────────────┘
```

**Microcopy:**

**Page Title:** `"Your [Destination] Adventure"` (not "Itinerary" - boring)

**AI Tip Banner:**
- `"💡 Your itinerary includes [X] bookable tours. Book now to save [Y]% vs. walk-up."`
- `"💡 We found [X] tours that match your interests. Tap to compare prices."`
- `"💡 Pro tip: Book the Eiffel Tower tour in advance to skip 2-hour lines."`

**Activity Cards:**
- Title: Activity name
- Details: `"[Time] • [Duration] • [Cost]"`
- Booking CTA: `"⭐ Book Skip-the-Line Tour"` (benefit-focused)
- Value prop: `"Save 2 hours wait time"` or `"Includes lunch & guide"`

**Action Buttons:**
- `"+ Add Activity"` (not "Add Item")
- `"✏️ Edit Day"` (clear action)
- `"🤖 Ask AI"` (conversational helper)

---

### **Step 4: AI Assistant (Contextual)**
**Where:** Sticky panel or modal  
**Goal:** Refine itinerary, suggest bookings

```
┌─────────────────────────────────────────┐
│  🤖 AI Assistant                        │
│                                         │
│  "How can I help improve your trip?"   │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Ask me anything...                │ │
│  └───────────────────────────────────┘ │
│  [Send]                                │
│                                         │
│  Quick suggestions:                    │
│  • Add a romantic dinner on Day 2      │
│  • Find kid-friendly activities        │
│  • Optimize route to save time         │
│  • Show me bookable tours              │
└─────────────────────────────────────────┘
```

**Microcopy:**

**Greeting:** `"How can I help improve your trip?"` (not "What do you want?")

**Input placeholder:** `"Ask me anything... (e.g., add a wine tasting)"`

**Quick suggestions (contextual):**
- `"Add a romantic dinner on Day 2"`
- `"Find kid-friendly activities"`
- `"Optimize route to save time"`
- `"Show me bookable tours"` ← Monetization prompt
- `"Suggest budget-friendly options"`
- `"Add a rest day"`

**AI Responses (examples):**
- ✅ `"I've added a Seine River dinner cruise on Day 2 at 7 PM. It's bookable for €89/person."`
- ✅ `"I found 3 kid-friendly activities near your hotel. Would you like to see them?"`
- ❌ `"I don't understand."` → Instead: `"I'm not sure about that. Try asking: 'Add a museum visit' or 'Find lunch spots'"`

---

### **Step 5: Tour Booking Connection**
**Where:** Inline within itinerary  
**Goal:** Seamless transition to booking

```
┌─────────────────────────────────────────────────────────┐
│  🗼 Eiffel Tower Visit                                  │
│  9:00 AM • 2 hours • Free (self-guided)                 │
│                                                         │
│  ⭐ Upgrade to Guided Tour                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Skip-the-Line + Summit Access                   │   │
│  │ ⭐ 4.9 (12,543 reviews)                         │   │
│  │                                                  │   │
│  │ €52 per person                                  │   │
│  │ ✓ Instant confirmation                          │   │
│  │ ✓ Free cancellation up to 24h                  │   │
│  │                                                  │   │
│  │ [Book This Tour →]                              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [Compare 3 Other Tours]                                │
└─────────────────────────────────────────────────────────┘
```

**Microcopy:**

**Upgrade CTA:** `"⭐ Upgrade to Guided Tour"` (not "Book Tour" - implies value add)

**Tour Card:**
- Title: Benefit-focused (e.g., `"Skip-the-Line + Summit Access"`)
- Social proof: `"⭐ 4.9 (12,543 reviews)"` (builds trust)
- Price: `"€52 per person"` (clear, no hidden fees)
- Trust badges:
  - `"✓ Instant confirmation"`
  - `"✓ Free cancellation up to 24h"`
  - `"✓ Best price guarantee"`

**Primary CTA:** `"Book This Tour →"` (action-oriented)

**Secondary CTA:** `"Compare 3 Other Tours"` (for price-conscious users)

---

## 2. WHERE SHOULD IT LIVE?

### **Recommended: Hybrid Approach**

#### **Homepage (Entry Point)**
```
Purpose: Capture intent
Elements:
- Hero search bar
- Quick example chips
- "How it works" (3 steps)
- Featured destinations
```

#### **Dedicated Page (Main Experience)**
```
URL: /plan or /itinerary/[id]
Purpose: Full itinerary creation & editing
Elements:
- Trip details form
- AI assistant panel
- Day-by-day itinerary
- Map view
- Bookable tour cards
- Save/share options
```

#### **Why Not Just Homepage?**
- Complex interactions need space
- Users need to edit/refine
- Bookable tours need prominence
- Shareable URLs for saved itineraries

#### **Why Not Separate App?**
- Adds friction (new tab/window)
- Breaks user flow
- Harder to track conversions
- SEO disadvantages

---

## 3. EXAMPLE MICROCOPY FOR AI INPUTS

### **Input Placeholders (Contextual)**

**Homepage Hero:**
```
"Where to? (e.g., Paris, 5 days, romantic)"
"Describe your dream trip... (e.g., Tokyo, family-friendly, 1 week)"
"Tell us about your trip (e.g., Bali, adventure, budget $2000)"
```

**AI Assistant Chat:**
```
"Ask me anything... (e.g., add a wine tasting)"
"How can I improve your trip?"
"Need help? Try: 'Find dinner spots' or 'Add a museum'"
```

**Quick Filters:**
```
"Budget: $ $$ $$$"
"Pace: Relaxed / Moderate / Packed"
"Style: Adventure / Culture / Relaxation / Foodie"
```

### **AI Response Templates**

**Success:**
```
✅ "I've added [Activity] on Day [X] at [Time]. It costs [Price]."
✅ "Found 3 [Type] activities near your hotel. Want to see them?"
✅ "I've optimized your route to save 45 minutes of travel time."
✅ "Great choice! This tour has 4.9★ and includes skip-the-line access."
```

**Clarification:**
```
🤔 "I found 5 dinner options. Do you prefer French cuisine or international?"
🤔 "What time works best? Morning (9-12) or afternoon (2-5)?"
🤔 "Budget for this activity: under €50 or flexible?"
```

**Limitations (Honest):**
```
⚠️ "I couldn't find bookable tours for that activity, but I've added it to your plan."
⚠️ "That time slot is tight. Want me to adjust your schedule?"
⚠️ "This activity is closed on Tuesdays. Should I move it to Wednesday?"
```

**Upsell (Subtle):**
```
💡 "This attraction has long lines. I found a skip-the-line tour for €15 more."
💡 "Pro tip: Booking this tour in advance saves 20% vs. walk-up."
💡 "Travelers who visited this also loved [Related Tour]. Want to add it?"
```

---

## 4. CONNECTING ITINERARY → BOOKABLE TOURS

### **Strategy: Progressive Enhancement**

#### **Phase 1: AI Suggests (Passive)**
```
Day 1 Activity: Eiffel Tower
└─ "💡 Tip: Skip-the-line tours available from €52"
   [View Tours]
```

#### **Phase 2: Inline Upgrade (Active)**
```
Day 1 Activity: Eiffel Tower (Free)
└─ ⭐ Upgrade to Guided Tour
   [Book Skip-the-Line Tour - €52]
```

#### **Phase 3: Smart Matching (Proactive)**
```
AI: "I noticed you're visiting 3 museums. 
     A Paris Museum Pass saves €40 and skips lines.
     [Add to Day 1]"
```

### **Connection Points**

#### **1. Activity Cards (Primary)**
```jsx
<ActivityCard>
  <ActivityInfo />
  {hasBookableTour && (
    <TourUpgrade>
      <Badge>⭐ Bookable Tour Available</Badge>
      <TourPreview />
      <Button>Book Now - €52</Button>
    </TourUpgrade>
  )}
</ActivityCard>
```

#### **2. AI Assistant (Conversational)**
```
User: "Add Louvre Museum"
AI: "Added! The Louvre has 2-hour lines. 
     Want a skip-the-line tour for €45?"
     [Yes, Add Tour] [No, Keep Free]
```

#### **3. Summary Panel (Overview)**
```
┌─────────────────────────────────────┐
│  Your Trip Summary                  │
│  ────────────────────────────────   │
│  12 activities planned              │
│  5 bookable tours available         │
│                                     │
│  💰 Book all tours: €340            │
│  💰 Walk-up price: €425             │
│  You save: €85 (20%)                │
│                                     │
│  [Book All Tours] [Review Tours]   │
└─────────────────────────────────────┘
```

#### **4. Email Follow-up (Retention)**
```
Subject: "Your Paris trip is ready! 🗼"

Hi [Name],

Your 5-day Paris itinerary is saved and ready to go!

📍 12 activities planned
⭐ 5 bookable tours available
💰 Save €85 by booking in advance

[View Your Itinerary]

P.S. The Eiffel Tower tour sells out fast. 
     Book now to secure your spot!
```

---

## 5. RISKS OF OVER-PROMISING AI

### **Risk 1: Hallucinations (Fake Information)**

**Problem:** AI invents attractions, prices, or details

**Mitigation:**
```
✅ Validate all AI outputs against real data
✅ Show confidence scores: "I'm 95% sure this is accurate"
✅ Add disclaimers: "Prices may vary. Check tour page for details."
✅ Human review for critical info (prices, hours, addresses)
```

**Copy Strategy:**
```
❌ "The Louvre is open 9-6 daily" (might be wrong)
✅ "The Louvre is typically open 9-6. Check official hours before visiting."
```

### **Risk 2: Unrealistic Expectations**

**Problem:** Users expect AI to book flights, hotels, etc.

**Mitigation:**
```
✅ Clear scope: "I help plan activities, not book flights"
✅ Set boundaries: "I can suggest hotels, but you'll book separately"
✅ Manage expectations: "I create itineraries. You book tours."
```

**Copy Strategy:**
```
Homepage: "AI-powered itinerary planner + bookable tours"
Not: "AI travel agent" (too broad)
```

### **Risk 3: Over-Automation (Loss of Control)**

**Problem:** Users feel AI is making decisions for them

**Mitigation:**
```
✅ Always show "Edit" and "Remove" options
✅ Explain AI suggestions: "I added this because..."
✅ Ask permission: "Should I add this?" vs. "I added this."
✅ Undo functionality: "Undo last change"
```

**Copy Strategy:**
```
✅ "I suggest adding a lunch break. Want me to add it?"
❌ "I added a lunch break." (too presumptuous)
```

### **Risk 4: Poor Recommendations**

**Problem:** AI suggests irrelevant or low-quality activities

**Mitigation:**
```
✅ User feedback: "Was this helpful? 👍 👎"
✅ Learn from behavior: Track what users keep vs. delete
✅ Quality filters: Only suggest 4+ star rated tours
✅ Personalization: "Based on your interests..."
```

**Copy Strategy:**
```
✅ "Based on your 'romantic' preference, I suggest..."
✅ "This tour has 4.9★ from 12,000+ travelers"
```

### **Risk 5: Technical Failures**

**Problem:** AI is slow, errors out, or produces gibberish

**Mitigation:**
```
✅ Fallback to templates: "Here's a popular 5-day Paris itinerary"
✅ Error messages: "AI is taking a break. Try our pre-made itineraries."
✅ Timeout handling: Show partial results after 15 seconds
✅ Retry logic: "That didn't work. Let me try again..."
```

**Copy Strategy:**
```
❌ "Error 500: Internal Server Error"
✅ "Oops! AI is having trouble. Here's a popular Paris itinerary instead."
```

### **Risk 6: Privacy Concerns**

**Problem:** Users worry about data usage

**Mitigation:**
```
✅ Transparency: "We use your input to create your itinerary. We don't sell data."
✅ Opt-in: "Save this itinerary? (We'll email you a copy)"
✅ Anonymous mode: "Plan without signing up"
```

**Copy Strategy:**
```
Footer: "Your privacy matters. We don't sell your travel plans."
```

---

## 6. COMPLETE UX FLOW WITH COPY

### **Flow 1: First-Time User (Homepage → Booking)**

```
STEP 1: Homepage
┌─────────────────────────────────────────┐
│  Where do you want to go?               │
│  ┌───────────────────────────────────┐  │
│  │ Paris, 5 days, romantic           │  │
│  └───────────────────────────────────┘  │
│  [Create My Itinerary] ✨               │
│  Free • 30 seconds • No signup          │
└─────────────────────────────────────────┘

STEP 2: Loading (10 seconds)
┌─────────────────────────────────────────┐
│  ✨ Creating Your Paris Trip             │
│  [████████░░] 80%                       │
│  → Matching bookable tours              │
│  "Hang tight! Planning the perfect      │
│   5 days in Paris..."                   │
└─────────────────────────────────────────┘

STEP 3: Itinerary Reveal
┌─────────────────────────────────────────┐
│  Your Paris Adventure                   │
│  📍 Paris • 5 Days • Feb 24-28          │
│                                         │
│  💡 Your itinerary includes 3 bookable  │
│     tours. Book now to save 15%.        │
│     [View Tours →]                      │
│                                         │
│  Day 1 - Eiffel Tower                   │
│  ⭐ Skip-the-Line Tour Available        │
│  [Book Now - €52]                       │
└─────────────────────────────────────────┘

STEP 4: Tour Booking
┌─────────────────────────────────────────┐
│  Eiffel Tower Skip-the-Line Tour        │
│  ⭐ 4.9 (12,543 reviews)                │
│  €52 per person                         │
│  ✓ Instant confirmation                 │
│  ✓ Free cancellation                    │
│  [Book on GetYourGuide →]               │
└─────────────────────────────────────────┘

STEP 5: Confirmation
┌─────────────────────────────────────────┐
│  ✅ Tour Added to Your Trip!            │
│  Check your email for booking details.  │
│                                         │
│  [Back to Itinerary] [Book More Tours] │
└─────────────────────────────────────────┘
```

### **Flow 2: Returning User (Edit & Refine)**

```
STEP 1: Saved Itinerary
┌─────────────────────────────────────────┐
│  Your Paris Adventure                   │
│  Last edited: 2 hours ago               │
│  [Continue Editing]                     │
└─────────────────────────────────────────┘

STEP 2: AI Assistant
┌─────────────────────────────────────────┐
│  🤖 "How can I improve your trip?"      │
│  User: "Add a wine tasting on Day 3"   │
│                                         │
│  AI: "I've added a Montmartre Wine      │
│       Tasting at 4 PM on Day 3.         │
│       It's bookable for €65/person.     │
│       [View Details] [Book Now]"        │
└─────────────────────────────────────────┘

STEP 3: Booking Summary
┌─────────────────────────────────────────┐
│  Ready to Book?                         │
│  3 tours selected • €167 total          │
│  💰 Save €42 vs. walk-up prices         │
│  [Book All Tours]                       │
└─────────────────────────────────────────┘
```

---

## 7. SUCCESS METRICS

### **Engagement Metrics**
- Itinerary completion rate: >70%
- Average activities per itinerary: 8-12
- AI assistant usage: >40% of users
- Edit/refine rate: >50%

### **Conversion Metrics**
- Itinerary → Tour view: >60%
- Tour view → Booking click: >25%
- Booking click → Affiliate conversion: >15%
- Average tours booked per itinerary: 2-3

### **Quality Metrics**
- User satisfaction (thumbs up): >85%
- Itinerary save rate: >60%
- Return user rate: >30%
- AI suggestion acceptance: >70%

---

## 8. IMPLEMENTATION CHECKLIST

### **Phase 1: MVP (Week 1-2)**
- [ ] Homepage search input
- [ ] Basic AI itinerary generation
- [ ] Day-by-day display
- [ ] Manual edit capabilities
- [ ] Tour card display (no booking yet)

### **Phase 2: AI Assistant (Week 3-4)**
- [ ] AI chat interface
- [ ] Quick suggestion chips
- [ ] Contextual responses
- [ ] Activity add/remove via AI

### **Phase 3: Booking Integration (Week 5-6)**
- [ ] Affiliate link integration
- [ ] Tour matching algorithm
- [ ] Inline booking CTAs
- [ ] Booking summary panel

### **Phase 4: Optimization (Week 7-8)**
- [ ] A/B test copy variations
- [ ] Improve AI response quality
- [ ] Add social proof
- [ ] Email follow-up system

---

## 9. COPY TESTING VARIATIONS

### **A/B Test: Primary CTA**
- A: `"Create My Itinerary"` (current)
- B: `"Plan My Trip"` (simpler)
- C: `"Get Started Free"` (value-focused)

### **A/B Test: AI Assistant Greeting**
- A: `"How can I help improve your trip?"` (helpful)
- B: `"What would you like to add?"` (direct)
- C: `"Need inspiration?"` (creative)

### **A/B Test: Tour Booking CTA**
- A: `"Book This Tour"` (direct)
- B: `"Reserve Your Spot"` (urgency)
- C: `"Add to Trip"` (low commitment)

---

**End of UX Design Document**

*Next Steps: Review with stakeholders, prototype key flows, user test with 5-10 travelers.*
