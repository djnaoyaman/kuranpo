# Monochrome + Traditional

All 78 original URLs/content/photo credits/scripts are preserved. The independent admission-fee correction is already merged as PR #1 (65fd428).

The early bootstrap selects saved `kuranpo-design`, defaulting to Monochrome when JavaScript is enabled. Without JavaScript, Traditional remains the unmodified rendering. All modern design CSS is opt-in; only the compact theme selector is shared. Structural wrappers move existing DOM nodes, retaining event handlers and quiz/filter state. Comment anchors restore original element order when returning to Traditional. No duplicate pages, content copies, canonical changes or URL redirects.

Motion is progressive: title staging, section entry, filter feedback, fine-pointer photo hover and a scroll progress line. No scroll hijacking or perpetual loops. Reduced-motion changes cancel active animations; keyboard focus cancels entering ancestors; coarse pointers and low-core devices get shorter effects. Content is never dependent on an animation to become visible.

Validation:
- `python3 tests/preservation.py`: exact original parsed markup/text/metadata/scripts/link/photo comparison against the fee-removal baseline, excluding only theme integration.
- `npm install && npx playwright install --with-deps chromium && npm run test:responsive`: viewport matrix 320/375/390/667 landscape/768/1024/1280/1440/1920, 78 routes, quiz and filter state, preference persistence/storage failure, touch, keyboard, long Japanese/English labels, 200% zoom, reduced-motion cancellation and no-JavaScript fallback.
- CI desktop/mobile full-page screenshots are retained as artifacts.

Browser QA must pass before production. Do not equate a configured test with a successful run or claim all physical devices have been tested.
