VETTIES HENGEL HOEKIE: WEBSITE
==============================

To preview, double-click preview.bat. It serves this folder at
http://localhost:8080 and opens it in your browser (close its window to stop).
Opening index.html straight from the disk also works, but browsers won't let
the 3D hero read the fish picture from a local file, so the hero shows the
flat version there. No build tools, keys or backend needed.
To go live, upload index.html, style.css, script.js, scene3d.js and the assets
and Gallery folders (keeping the folder structure) to any static host.

WHERE TO CHANGE THINGS
----------------------
Shop details, hours, people, stock categories:         script.js (CONFIG at the top)
Gallery photos ("Inside the shop"):                     Gallery folder, listed in CONFIG.photos
Google reviews ("What anglers say"):                    script.js (CONFIG.reviews and googleRating)
Colours and fonts:                                      style.css (:root at the top)
Page structure and wording of headings:                 index.html
Tab icon:                                               assets/favicon.svg
Header/footer logo and the leaping bass in the hero:    assets/logo.png and assets/fish.webp
3D scenes (hero, shelf models, bobber):                 scene3d.js (SETTINGS at the top)

CHECK WITH THE OWNERS BEFORE PUBLISHING
---------------------------------------
1. Contact people. The two flyers list different people (Ruan on one,
   Leon on the other; Benjamin on both). Confirm who should be listed.
2. Which number the WhatsApp buttons and stock form go to (mainWhatsapp).
3. The stock categories and the short descriptions under each.
4. Get their logo file. (The shop photos are in the Gallery folder.)
5. Ask whether they want a "Website by ..." credit in the footer.
6. That they're happy for the Google reviews to be quoted on the site, and
   whether the Ruan Jacobs who left a 5-star rating works at the shop.

THE "OPEN NOW" BADGE
--------------------
Worked out in South African time from CONFIG.hours. Public holidays use
holidayHours, based on the dates in CONFIG.publicHolidays. Update that
list every year from the official list on gov.za, or the badge will be
wrong on public holidays.

THE GALLERY ("INSIDE THE SHOP")
------------------------------
One big photo, with the next one peeking out on the right, tilted. Click the
arrow or the peeking photo (or swipe on a phone, or use the arrow keys) to move
on; once you have, the previous photo peeks out on the left too. It goes round
in a loop: after the last photo comes the first again (and going back from the
first photo goes to the last).
To add a photo: put the file in the Gallery folder, then add a line to
CONFIG.photos in script.js with its file name (src), a short caption, and an
alt description for people who can't see it. The list's order is the order
on the site. Photos keep their own shape (tall, wide or square). Resize big
phone photos to about 1600px wide first, or the page gets slow to load.
Only the photo showing and the two either side of it are loaded at a time.
To hide the section, empty the list: photos: []

THE REVIEWS ("WHAT ANGLERS SAY")
--------------------------------
Copied by hand from the shop's Google listing (Google Maps > Reviews), so they
don't update by themselves. When new reviews come in:
- Add them to CONFIG.reviews: name, stars, and text if the review has words.
  Reviews without text are listed by name under "Also rated".
- Update googleRating (the stars and number of reviews Google shows).
Names are written as first name and surname initial. Reviews show initials in
coloured circles rather than people's Google photos: Google's terms don't allow
copying those onto another site. The "reviews on Google" link goes to mapUrl.
Ruan Jacobs's rating is left out on purpose, in case he's the Ruan who works
at the shop. To hide the section, empty the list: reviews: []

THE STOCK FORM
--------------
It doesn't send anything by itself. It opens WhatsApp with the message
ready, and the customer presses Send. Nothing is stored on the website.

THE MOVING PARTS
----------------
Everything below is decoration. Screen readers skip it (aria-hidden) and the
shop's details work the same without it.

3D (scene3d.js, using Three.js loaded from the jsDelivr CDN):
- The hero. The bass from the logo, puffed out into a 3D shape, jumps out of
  the water when the page opens. It hangs over moving water with its
  reflection, glints of light and rings spreading under its tail. It turns
  toward the mouse, rises as you scroll, and leaps with a splash when you click
  it. Click the water anywhere for a ripple. Bubbles drift up from the water.
- 3D models on the "What's on the shelves" items: a crankbait, a spinning reel,
  a rod, a bottle of dip, a hook and a tackle box. Each one moves when you
  hover (the reel cranks, the rod bends, the box opens...), and once as it
  scrolls into view on a phone. Each stock item picks its model with icon:
  'rod' etc. in CONFIG.stock. The models are in MODELS in scene3d.js; an item
  whose icon has no model keeps its flat drawing.
- The bobber above the Visit section floats on the waves and dips under when
  you hover or tap it.
- If a browser can't show 3D, or the CDN can't be reached, the flat versions
  below stay instead. Nothing else on the page depends on it.

Flat (script.js and style.css):
- Fishing line and hook (right edge of the screen). The line gets longer as you
  scroll down and swings when you scroll fast. Click or tap the hook to reel
  back to the top. Code: setupMotion() in script.js, .cast in style.css.
- The flat bass in the hero, used when 3D is off. It bobs on its own, drifts
  toward the mouse, rises a little as you scroll, and leaps when you click it.
  Code: setupMotion() and setupHeroPlay(), .fish-wrap and .fish in style.css.
- Water rings under the flat fish, rising bubbles, and a ripple wherever you
  click in the hero. Code: setupBubbles() and setupHeroPlay().
- Animated promise icons (and the flat shelf icons, used when 3D is off). They
  play when you hover (or when they scroll into view on a phone, once). The
  drawings live in the ICONS object at the top of script.js. To add a new one,
  add a new entry to ICONS and give the moving part a class like a-tail (see
  the .a-* rules in style.css).
- Waves above the Visit section and the footer. Code: .shore, .waves, .bobber
  in style.css.

TUNING OR TURNING THINGS OFF
----------------------------
- Turn off a 3D part (hero, shelf or bobber): set it to false in SETTINGS at
  the top of scene3d.js. The flat version shows instead.
- Hide the fishing line completely: add  display: none;  to .cast in style.css.
- Fewer bubbles: bubbleCount in scene3d.js (3D hero), or the numbers in
  setupBubbles() in script.js (flat hero).
- How far the line reaches down the screen: "reach" in setupMotion().
- Visitors whose device is set to "reduce motion" automatically get a still
  page (no bubbles, no waves, no swinging; the 3D scenes are drawn once and
  don't move). The hook still works as a normal back-to-top button for them.

FILES TO UPLOAD
---------------
index.html, style.css, script.js, scene3d.js, the whole assets folder
(favicon.svg, logo.png, fish.webp) and the whole Gallery folder. The fish will
be missing if fish.webp is not inside assets/. Most web hosts care about
capital letters, so keep the folder named "Gallery" exactly as it is in
CONFIG.photos. preview.bat, preview.ps1 and the .claude folder are only
for previewing on this computer; don't upload them.
