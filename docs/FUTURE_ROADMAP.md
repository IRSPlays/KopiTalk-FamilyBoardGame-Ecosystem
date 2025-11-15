# 🚀 Future Roadmap – SingaPlayGO Revival Blueprint

_Last prepared: November 15, 2025_

This document is a self‑contained relaunch playbook for reviving SingaPlayGO after the competition. It distills the current state, outstanding work, and a phased strategy to reach a polished 1.0 release.

---
## 🧭 Vision Recap
SingaPlayGO is a **physical D.I.Y. intergenerational board game** whose app:
- Captures the real board (ESP32-CAM) and processes layout & player movement logic.
- Generates AI dish challenges; players earn money through culturally grounded activities.
- Reinforces bonding: youth teaches digital fluency, elderly teaches heritage & market culture.

Core identity pillars to preserve:
1. Physical board authenticity (no shift to virtual simulation).
2. Movement driven by AI conversation quality & social engagement – not dice randomness.
3. Earnings as a facilitation of common ground, not competitive grind.
4. Singapore cultural fidelity (wet market etiquette, hawker traditions, MRT norms).

---
## 📌 Current Completion Snapshot
| Area | Status | Notes |
|------|--------|-------|
| DeliveryApp Remake | ✅ | Weather multiplier, earnings, selectors, activity logging |
| SupermarketSelfOrder Remake | ✅ | 5-step tutorial (youth→elderly), payment path, earnings |
| UI Audit (69 Files) | ✅ | Alignment matrix produced (UI_AUDIT_REPORT.md) |
| Research Integration | ✅ | Zustand + Framer + Cultural refs (RESEARCH_NOTES.md) |
| Transport System (Bus/EZ-Link) | 🔄 | Needs unified flow + ezlink_balance persistence |
| GameHub Modernization | 🔄 | Mock removal & live store wiring pending |
| BoardGame Flow | 🔄 | BoardBuilderModal + dish generation trigger incomplete |
| Cooking Victory Layer | ⚠️ | Various cooking game variants exist; unify + victory screen |
| Weather Challenge Modal | ⚠️ | Logic partly present; missing dedicated UI trigger |
| TikTok / Vision Scoring | ⚠️ | Recording UI present; no quality scoring/earnings pipeline |
| Accessibility / Performance Pass | ⚠️ | Base touch targets ok; deeper audit still needed |
| GameStore Type Hardening | ⚠️ | Types good but activity/category enums can be tightened |

---
## 🗂 Phase Breakdown (Strategic Ordering)
### Phase 1 – Core Gameplay Continuity (Weeks 1–2)
Focus: Transport, primary hub, main orchestration
- Complete BusTimings + EZLinkTopUp unified component (transport teaching → earnings $10–18).
- Modernize GameHub (remove mock arrays, plug in selectors, show bonding & budget live).
- BoardGame: Insert BoardBuilderModal step → trigger dishChallenge AI → show ActivitiesHub FAB.
- Add GameVictoryScreen + finish cooking success pipeline (score → reward → summary).
- Create/finish WeatherChallengeModal; wire dynamic priceMultiplier & route impacts.

### Phase 2 – Social & Media Layer (Weeks 3–4)
- TikTokRecordingModal: Gemini Vision scoring (clarity, engagement, family participation).
- StorySharing enhancement: structured transcript analysis (sentiment → bonding increment).
- PayLahTransaction (or generic ePayment) teaching module – security + digital literacy.
- MoneySavingModal: budgeting advice (elderly wisdom vs youth digital deals) → mini outcomes.

### Phase 3 – Polish & Depth (Weeks 5–6)
- IngredientTracker 2.0: progress bar, source badges (wet_market / delivery / supermarket), completion projection.
- WetMarketShopping cultural expansion: bargaining outcome tiers, language/dialect hints.
- Add RandomEvent/Weather synergy: closures, price spikes, route delays.
- LocationIcon / ESP32 live position overlays (non-blocking – MVP simplified placeholder first).

### Phase 4 – Quality Gates & Optimization (Weeks 7–8)
- Type tightening: discriminated unions for activities & challenges.
- Accessibility: focus order, aria-live for earnings, color contrast audit.
- Performance: code splitting heavy pages (cooking modes, AI modules), memoization where stable.
- Introduce `useGameMetrics()` derived selector (bonding %, ingredients %, earnings breakdown).

### Phase 5 – Release Preparation (Weeks 9–10)
- End-to-end test harness: board build → dish → earn → collect → cook → victory.
- Session export card (PNG summary) for sharing.
- Dark mode + prefers-color-scheme.
- Final doc sweep → CHANGELOG + semantic versioning adoption.

---
## 🛠 Technical Enhancements (Targeted)
| Category | Enhancement | Benefit |
|----------|-------------|---------|
| State | Extract constants (earnings, activity types) → `config/gameEconomy.ts` | Single source of truth, avoid magic numbers |
| State | Add selector hooks alias, e.g. `useFamilyBudget()` | Readability & future caching |
| State | Introduce activity schema validator (Zod / lightweight) | Prevent malformed entries |
| Performance | Lazy import AI-heavy components | Faster first paint |
| Performance | Framer Motion layoutId rationalization | Reduce unnecessary animations cost |
| Vision | Debounce ESP32 frame processing | Lower CPU usage, smoother UI |
| Dev | Internal `/dev` panel with store snapshot & hydration status | Faster debugging |
| Analytics | Simple in-memory session event recorder (exportable) | Post-play storytelling |

---
## 🔒 Risk & Mitigation Matrix
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Feature creep (too many activities) | Delay 1.0 | Enforce Phase scope locks |
| ESP32 instability / frame drops | Movement mis-sync | Graceful fallback: manual position adjust panel |
| AI latency > 2s | Frustration | Cache last prompt & optimistic UI | 
| Cultural misrepresentation | User trust | Keep research references, add review checklist |
| Accessibility gaps | Excludes elderly | Regular lighthouse + manual keyboard checks |

---
## 📏 Success Metrics (Objective Targets)
| Metric | Target | Current (Est.) |
|--------|--------|----------------|
| Initial load (mobile) | < 3.0s | ~3.8s (needs lazy splitting) |
| Conversation → Movement latency | < 2.0s | ~2.3s |
| Ingredient tracking accuracy | 100% vs store | ~95% (pending unified method tagging) |
| Weather challenge UI respond time | < 250ms | N/A (modal not built) |
| Accessibility touch targets compliance | 100% | ~85% |

Bonding Level Formula (proposed):
```
Bonding Increment = (StoryDepthScore * 0.4) + (CulturalExchangeScore * 0.35) + (MutualTeachingScore * 0.25)
Movement Tiles = clamp( round(Bonding Increment / 10), 1, 5 )
```

---
## 🧪 Testing Priorities (Progressive)
1. Unit: economy (budget cannot go negative; earnings accumulate)
2. Unit: markIngredientCollected (case-insensitive, idempotent)
3. Integration: DeliveryApp purchase → ingredient → tracker update
4. Integration: Tutorial completion → activity log entry → budget increase
5. E2E: Board build → dish generation → full ingredient collection → cooking victory
6. Resilience: Refresh mid-session → persistence rehydrate correctness

---
## 📦 Backlog Grooming Protocol
- KEEP items only if they directly support intergenerational bonding or physical board authenticity.
- Every new feature proposal must answer: “Does this strengthen youth↔elderly mutual learning?”
- Reject features that shift focus toward pure gamification without cultural/teaching layer.

Weekly groom template:
```
For each ticket:
1. Core pillar alignment (Yes/No)
2. Phase fit (Current / Future / Drop)
3. Complexity (S / M / L)
4. Test surface additions needed?
5. Rollback plan (if needed)
```

---
## 🔁 30 / 60 / 90 Day Condensed Goals
| Day Range | Primary Goal | Secondary | Exit Criteria |
|-----------|--------------|-----------|---------------|
| 0–30 | Core flow continuity (Phase 1) | Start social/TikTok prep | Playable loop without mocks |
| 31–60 | Social + Polish (Phase 2 & 3) | Performance passes | Full ingredient & transport realism |
| 61–90 | QA + Release hardening (Phase 4 & 5) | Export/share features | RC build, documented metrics |

---
## 🧪 Suggested Minimal Test Harness (Sketch)
```typescript
// pseudo-code
it('Full Loop', async () => {
  startNewGame(difficulty='expert')
  buildBoard(minTiles)
  generateDish()
  performActivity('photo_challenge')
  expect(family_budget).toBeGreaterThan(0)
  collectAllIngredients(['delivery','supermarket','wet_market'])
  startCookingGame()
  finishWithScore(>80)
  expect(gameCompleted).toBe(true)
})
```

---
## 📝 Revival Checklist (Copy/Paste When Returning)
```
1. git pull / verify tag v0.9.5-alpha-final exists
2. npm install (update lock if Node version changed)
3. Open gameStore.ts – confirm types still match persisted shape
4. Review UI_AUDIT_REPORT.md – pick top 3 remaining Phase 1 targets
5. Implement BusTimings + EZLinkTopUp unified component
6. Integrate BoardBuilderModal into BoardGame flow
7. Add WeatherChallengeModal + hook into DeliveryApp pricing
8. Create GameVictoryScreen with summary & export option
9. Add basic tests for economy & ingredient flow
10. Record performance metrics (pre-optimization baseline)
```

---
## ✅ Non-Negotiables To Preserve
- Physical board remains gameplay anchor.
- Movement earned through social interaction quality (NOT RNG).
- Cultural respect (no caricatures; use authentic phrasing & context).
- Intergenerational teaching wins over pure mechanical mastery.

---
## 💡 Stretch Ideas (Post 1.0)
| Idea | Value | Complexity |
|------|-------|-----------|
| Session Memory Scrapbook | Emotional retention | M |
| Dialect Phrase Unlockables | Cultural depth | M |
| Weather-driven Ingredient Scarcity | Strategic variance | L |
| AI Story Montage Export | Shareable bonding artifact | M |
| Optional Remote Assist (Video overlay) | Distributed families | H |

---
## 🧾 Licensing & Attribution To Maintain
- Maintain MIT license header.
- Attribute Gemini usage when generating public summaries.
- Note cultural content sources (DeepWiki research logs) in docs.

---
## 🏁 Finish Line Definition for v1.0
A family can: build physical board → generate dish → teach & learn → earn → collect → cook → celebrate → export memory — without mocks, with stable performance, accessible interaction, and culturally genuine flows.

---
**Prepared for future revival.** When you return, start with Phase 1 checklist and resist scope creep.

_“Bonding first, mechanics second.”_
