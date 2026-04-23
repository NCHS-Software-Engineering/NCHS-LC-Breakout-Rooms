## What did you change?
Describe what you added or fixed in this PR.

---

## Who is this for?
- [ ] Student (signing out / checking availability)
- [ ] Staff / Admin (managing rooms, viewing reservations, force-ending)

What are they trying to do, and what should happen after?

---

## Show your work (Required if UI changed)
Add screenshots or a short screen recording.

- Desktop view:
- Mobile or small screen view:

---

## Next.js Basics Check
- [ ] Pages or routes load correctly
- [ ] Navigation uses `<Link>` (not regular `<a>` tags for internal links)
- [ ] Page does not fully reload when navigating
- [ ] No red errors in the browser console
- [ ] No hydration warnings

---

## Auth & Login
- [ ] Google login works and redirects correctly
- [ ] Logged-out users cannot access protected pages
- [ ] The correct name/account is shown after logging in
- [ ] Students cannot access admin-only pages

---

## Calendar & Time Slot View
- [ ] Available and taken time slots are clearly distinguishable
- [ ] Selecting a time slot works as expected
- [ ] Fixed time slots display correctly and in the right order
- [ ] Past time slots are not bookable
- [ ] The calendar updates correctly after a reservation is made

---

## Room Sign-Out Flow
- [ ] A student can successfully sign out an available room
- [ ] A student cannot book a slot that's already taken
- [ ] The reservation is correctly tied to the logged-in student's account
- [ ] The room shows as unavailable immediately after booking

---

## Admin Flow (if this PR touches admin features)
- [ ] Admins can see all active reservations
- [ ] Admins can force-end a reservation and the slot reopens
- [ ] Admins can mark a room as unavailable and it disappears for students
- [ ] Admin actions do not affect unrelated reservations

---

## Loading, Error, and Empty States
- [ ] The calendar shows something while room data is loading
- [ ] Errors show a helpful message (not just "error")
- [ ] If no rooms are available, the screen explains that clearly
- [ ] The app never shows a blank screen

---

## Accessibility & Usability
- [ ] I can use this feature with the keyboard only
- [ ] Buttons and links clearly say what they do
- [ ] Text is readable and high contrast
- [ ] Focus is visible when tabbing

---

## Responsive Design
- [ ] Works on a small screen (students may be on their phone)
- [ ] No horizontal scrolling
- [ ] Buttons and time slots are easy to tap on mobile

---

## Database (MySQL)
- [ ] Reservations are saved correctly to the database
- [ ] Cancelled or force-ended reservations are removed or updated in the database
- [ ] Student information is stored and retrieved correctly
- [ ] No duplicate reservations are created for the same slot

---

## Final Self-Check
- [ ] I tested the full flow as a student (log in → find a slot → sign out a room)
- [ ] I tested the full flow as an admin (view reservations → force-end → manage rooms)
- [ ] I tested at least one thing going wrong (e.g. slot already taken, booking a past slot)
- [ ] I would understand this PR without explanation

---

## Questions or Notes for the Reviewer
Anything you're unsure about?
