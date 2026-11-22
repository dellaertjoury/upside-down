# THE UPSIDE DOWN

An endless pixel-art runner inspired by the dino game Chrome shows when you're
offline, with one twist: the floor has two sides. The top half is a quiet
suburban street. The bottom half is the **Upside Down**. Flip through the floor
to dodge whatever blocks your side.

Every run starts at the door of the **Hellfire Club**, the D&D group's hangout.
Fill in your character sheet there, then head out.

Plain HTML + JavaScript. No build step, no dependencies.

## Play

- **Online:** https://dellaertjoury.github.io/upside-down/
  Every push to `main` redeploys it through `.github/workflows/deploy.yml`
  (about a minute). One-time setup: Settings → Pages → Source: **GitHub Actions**.
- **Locally:** `python3 -m http.server` in this folder, then open http://localhost:8000.
  (Opening `index.html` directly works too, but PNG art overrides need a server.)

## Controls

Jump, roll, attack and flip each have one key and one controller button, and
you can change them in **Settings → Controls**. Pause is always Esc (Start on
a controller). Defaults:

| Action | Keyboard | Controller | Touch |
|---|---|---|---|
| Jump | ↑ | A | Jump button or swipe up |
| Roll | ↓ | B | Roll button or swipe down |
| Attack (bat or slingshot) | Space | X | Hit button or swipe sideways |
| Flip to the other side | F | Y | Flip button or tap |
| Pause | Esc | Start | |
| Report a bug or idea | F8 | | |

The mouse only works in the menus, not in the game.

The controls are the same in the Upside Down: ↑ jumps away from the floor,
↓ rolls. In the air, roll and flip do a fast-fall first.
A swing or a slingshot marble also knocks spore shots away.

**Controller:** any standard gamepad (Xbox, PlayStation, Switch Pro in a
browser that supports it). In menus the D-pad or left stick moves, A selects,
B goes back and Start starts a run.

## Settings

Music and sound effects (on/off and volume), language (English, Nederlands;
add more in `js/i18n.js`), full screen, when to show the touch buttons, and
the controls above. Everything is saved in the browser.

## Character sheet (D&D style)

No dice rolls for stats: everyone starts with every ability at 10, plus the
class bonus. Pick a class: Fighter (bat, STR +2, CON +1) or Ranger (slingshot,
DEX +2, WIS +1). Rogue and Wizard are still locked. Each upgrade level raises
its ability by 2, so the sheet levels up as you buy upgrades:

| Ability | Grows with |
|---|---|
| STR | Longer bat |
| DEX | Double jump, Skateboard |
| CON | Extra heart |
| INT | Dark greed |
| WIS | Flashlight battery |
| CHA | Light magnet |

## Dice Crates (the d20)

The dice live in **Dice Crates**: red-marked crates that turn up about once a
minute (more often in the Upside Down, sometimes on top of a car). Grab one and
it's yours for the run, even if you die. After the run you open them on the
game-over screen: roll the d20 (Space / A), and the roll sets the odds.

| Roll | Rare (40–60 lights) | Legendary (a free upgrade level) |
|---|---|---|
| 1 | 2.5% | 0% |
| 10 | 25% | 0% |
| 16 | 40% | 3% |
| 19 | 47.5% | 12% |
| Natural 20 | | 100% |

Otherwise it's uncommon (15–25 lights, 40%) or common (5–10). A legendary pays
150 lights once every upgrade is maxed. Unopened crates wait for your next
game-over screen.

## The Watcher

Now and then an original colossal shadow creature rises far away in the
Upside Down sky. It's barely visible until lightning lights it up; it sways
its head and bobs while it drifts past. It's scenery, not an enemy.

## Sound

All sound is generated live with WebAudio, no audio files. The background
music (`MUSIC` in `js/audio.js`) is an original 8-bit score in an 80s synth
horror style: arpeggio and pad at the Hellfire Club; bass, drums and a lead
melody during a run; and the same song muffled, detuned and over a low drone
in the Upside Down. Music and sound effects each have their own toggle on
the menu.

## Rules

- You run automatically, starting slow and speeding up gradually.
- **Enemies, by height:** bats and crows fly at head height: **roll under**
  them. Hounds run on the ground: **jump over** them. Walkers are twice your
  height and can't be cleared: **attack** them (2 hits) or flip away. Hounds
  and walkers also cross over to the street later in a run (120 m / 350 m).
- **Obstacles:** stumps you jump, hanging vines you roll under. Hounds
  sometimes lunge forward (still on the ground). Spore pods shoot along the ground every few seconds: jump them, flip away,
  or hit the shot back.
- **The Upside Down: Heat and the haul.** Everything you earn down there
  (distance, kills, lights) goes into a **haul**, multiplied by **Heat**:
  x1.5 when you arrive, +0.5 every 2 seconds you stay, up to x4 (more with
  Dark greed). Most loose lights spawn down there. Getting hit cools the Heat
  back to x1.5.
  - **Flip back up yourself** to bank the haul. Flip with the Dread over 75%
    for a **close call: +25%**.
  - **Dragged out** when the Dread fills: you keep only half.
  - **Die down there**: the haul is lost.
  The Dread fills in about 8 seconds (before upgrades) and drains on the street.
- **Things to jump on:** every 9–14 seconds a dumpster, car, police car, van,
  pickup or school bus rolls by at real size, sometimes two in a row to hop
  between. Land on it from above (running past its front never hurts); its
  surface follows its shape: run up the windshield onto the roof and down
  onto the trunk. Each one carries one thing: lights showing the way up
  (jump where the arc starts and you land on it), lights to jump off its end,
  lights above a wide one to jump for from its roof, a crate, or a Dice
  Crate. Works in the Upside Down too.

## Classes and attacks

| Class | Attack | Perk | Weakness |
|---|---|---|---|
| Fighter | Bat: kills in 1 hit, knocks spore shots back | **Trash-can lid** absorbs one hit, recharges in 18 s | Has to get close |
| Ranger | Marble lobbed in an arc to about half the screen | **Roll + attack** = low skipping shot for ground enemies; light magnet ×1.5 | Arc misses low targets unless you skip-shoot |
| Wizard *(locked)* | Bolt straight across the whole screen, pierces 1 enemy | Dread fills **25% slower** | Half damage: 2 hits per enemy (stalker 4) |
| Rogue *(locked)* | Fast jabs, 1 in 4 crits for double damage | Heat climbs **50% faster** | Short reach |

## Score

The high score is one number made of three parts, shown after each run:

- **Distance:** 1 point per metre (×2 in the Upside Down).
- **Combat:** points per kill: flyers (crows, flyers) 10, crawlers (hounds,
  spore pods) 15, walkers (stalkers) 25. In the Upside Down × Heat (banked).
- **Lights:** 5 points per light collected.

## Christmas lights (the currency)

- Bulbs float high (jump for them), alone or in rows of 2–3 that follow the
  arc of a jump, so one well-timed jump collects them all. Three in four
  spawn in the Upside Down and go into your haul. The rare gold bulb is worth 5.
- **Crates** about every 20 seconds: small (3 lights), medium (5) or big with
  a gold glow (10); big crates get more common the further you run. One in
  four crates holds a heart instead (lights if you're at full health). Hit
  a crate to open it; running into it wastes it.
- **Kills** pay in points only: enemies never drop lights.
- **Milestones:** every 500 m gives +10 lights.
- At the end of a run you bank the lights plus a score bonus, and spend them
  on permanent upgrades. That's the roguelike loop.

All of these numbers live in the `BAL` block at the top of `js/game.js`.

## Upgrades

| Upgrade | Levels | Effect |
|---|---|---|
| Extra heart | 3 | +1 hit per run |
| Longer bat | 3 | +6 px melee reach |
| Flashlight battery | 4 | +2 s in the Upside Down |
| Light magnet | 3 | Bigger pickup radius |
| Dark greed | 3 | +0.5 maximum Heat, +1 per Upside Down light |
| Skateboard | 3 | Skateboards show up in runs (every 35–60 s): grab one to ride through everything, invincible and faster, for 4 / 6 / 8 s. Smashes enemies, obstacles and crates; Dread pauses |
| Double jump | 1 | Jump again in mid-air |
| Second wind | 1 | Survive one fatal hit per run |

Tune costs and effects in `js/save.js` (`UPGRADES`, `runStats`).

## Online leaderboard

The leaderboard picks a backend automatically:

1. **Claude artifact.** When the game is published as a Claude artifact, scores
   go into that artifact's shared database. Friends open the shared link while
   signed in to Claude. To post scores they need Contributor or Editor access
   on the share menu. Viewers can see the board but can't post.
2. **Supabase (for GitHub Pages).** Free, about 5 minutes:
   1. Create a project at supabase.com.
   2. In the SQL editor, run `supabase.sql` from this repo.
   3. Project Settings → API: copy the **Project URL** and the **anon public**
      key into `js/config.js`. Commit and push.
3. **Local.** If neither is available, the best runs are kept on this device.

Players set their name on the main menu. Only that name and the score are stored.

## Scenery

The town is built on the fly from "floor frames": blank stretches with a
prop or two, and every 2–4 blanks a building (house, two houses, school,
police station, store, arcade, diner, gas station). The next 3 frames are
always generated ahead of the screen, so buildings slide in smoothly. The
Upside Down mirrors the same street, rotten. Tune it in `js/scenery.js`
(`MIN_BLANKS`, `MAX_BLANKS`, `PARALLAX`).

## Reporting bugs and ideas

**Report bug / idea** in the hub, pause or game-over menu (Settings is in the pause menu too), or press **F8** in
the middle of a run: the game pauses and takes a screenshot of that exact frame.
Pick Bug or Idea, write what happened, and save (Ctrl+Enter). Each report also
stores the game state at that moment (build, distance, speed, side, player
state, what was on screen, recent errors).

Reports stay in your browser. **Export file** downloads them all as one
`.json` file (screenshots included) to send to Claude; **Copy as text** copies
the comments without screenshots. To read an export yourself:

```
python3 tools/unpack_reports.py upside-down-reports-<date>.json
```

## Art

The game uses the painted pixel art in `assets/`. Anything without art falls
back to a built-in placeholder drawn in `js/sprites.js`.

New art goes through **[ART_PROMPTS.md](ART_PROMPTS.md)**: 38 sprite-sheet
prompts, 180 frames in all. Players come in 4 sheets each (`fighter_sheet1.png`
… `fighter_sheet4.png`, 2 rows per image for more detail); creatures, vehicles
and UI sets in one sheet each (`hound_sheet.png`, `plat_car_sheet.png`). Then run

```
python3 tools/process_art.py <folder with raw PNGs> assets/
```

One animation per image also works (`fighter_run_strip.png`), and so do single
frames (`fighter_run3.png`, see `ART_PROMPTS_frames.md`).

The script removes the background (flat magenta, black, white or a fake
checkerboard), cuts each sheet into frames on the empty gaps, scales a whole
sheet with one factor (so a roll stays smaller than a run frame) and rewrites
`assets/manifest.json`. The canvas renders at 3× (1200 × 675), so art keeps its
detail while gameplay runs on a 400 × 225 grid.

## Project layout

```
index.html          menus + canvas
css/style.css       arcade-cabinet styling
js/config.js        optional Supabase keys
js/sprites.js       pixel sprites, procedural backgrounds, PNG overrides
js/audio.js         chiptune sound effects (WebAudio, no files)
js/save.js          progress, character sheet, dice, upgrades
js/leaderboard.js   claude / supabase / local leaderboard
js/scenery.js       the street: blank stretches, buildings, props
js/i18n.js          translations (English, Nederlands)
js/input.js         keyboard + controller bindings
js/game.js          the game: physics, spawning, collisions, rendering
js/ui.js            hub, character sheet and other menus
assets/             game art + manifest.json
tools/process_art.py  turns raw ChatGPT images into game sprites
```

## Adding classes later

Classes live in `CLASSES` in `js/save.js`. Set `locked: false` and give a class
its own ability bonus; new class-specific moves go in `js/game.js`.

---
A fan project inspired by a TV series. The characters, monsters, emblem and
all art in this repo are original; no logos from the show are used.

## Testing and debugging

Press **F9** in the game (or open the link with `#debug` at the end) for the
debug panel:

- **Live state:** build version, FPS, speed, distance, side, Dread, what's on
  screen, and the upcoming scenery frames.
- **Cheats:** show hitboxes, god mode, Dread never fills, no obstacles, slow
  motion (0.25×–2×).
- **Tools:** spawn any obstacle or enemy, spawn lights, jump +1000 m, add 500
  lights, unlock the locked classes, reset your save.
- **Errors:** any JavaScript error is caught and listed.
- **Copy report:** puts all of the above on your clipboard. Paste it into a
  message or a GitHub issue when something goes wrong.

The `build` line shows which commit is live, so you can check that a deploy
landed (`local` when running from your own computer).
