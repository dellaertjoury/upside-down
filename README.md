# THE UPSIDE DOWN

An endless pixel-art runner inspired by the dino game Chrome shows when you're
offline, with one twist: the floor has two sides. The top half is a quiet
suburban street. The bottom half is the **Upside Down**. Flip through the floor
to dodge whatever blocks your side.

Every run starts at the door of the **Hellfire Club**, the D&D group's hangout.
Roll up a character sheet there, then head out.

Plain HTML + JavaScript. No build step, no dependencies.

## Play

- **Online:** https://dellaertjoury.github.io/upside-down/
  Every push to `main` redeploys it through `.github/workflows/deploy.yml`
  (about a minute). One-time setup: Settings → Pages → Source: **GitHub Actions**.
- **Locally:** `python3 -m http.server` in this folder, then open http://localhost:8000.
  (Opening `index.html` directly works too, but PNG art overrides need a server.)

## Controls

Every key and controller button can be changed in **Settings → Controls**
(two keyboard keys and two controller buttons per action). Defaults:

| Action | Keyboard | Controller | Touch |
|---|---|---|---|
| Jump | ↑ / W | A / D-pad ↑ | Jump button or swipe up |
| Roll | ↓ / S | B / D-pad ↓ | Roll button or swipe down |
| Attack (bat or slingshot) | Space | X / RT | Hit button or swipe sideways |
| Flip to the other side | F | Y / RB | Flip button or tap |
| Pause | P / Esc | Start | |

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

Roll **4d6, drop the lowest** for each ability. You get 3 free rerolls, then
each reroll costs 10 lights. Pick a class: Fighter (bat, STR +2, CON +1) or
Ranger (slingshot, DEX +2, WIS +1). Rogue and Wizard are still locked.

| Ability | In game |
|---|---|
| STR | Bat reach |
| DEX | Jump height |
| CON | Extra hearts (+1 per +2 modifier) |
| INT | Bigger light bonus after each run |
| WIS | Longer in the Upside Down before the Dread throws you out |
| CHA | Light magnet range |

**D20 fate:** each run opens with a d20 roll. A natural 20 gives +1 heart, 15–19
gives +20% score, 2–5 fills Dread 15% faster, and a natural 1 fills it 30% faster.

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
- **Obstacles:** crows at head height (roll under, jump over or hit them),
  stumps you jump, hanging vines you roll under, and Upside Down creatures you
  hit or avoid. The tall **stalker** takes two hits. Hounds sometimes pounce.
  Spore pods shoot along the ground every few seconds: jump them, flip away,
  or hit the shot back.
- **The Upside Down** scores ×2 (more with upgrades) and its lights count
  double. But the **Dread** meter fills while you're down there (about 8
  seconds before upgrades). When it's full you get thrown back up and can't
  flip again for a moment.
- **Rooftops:** every 11–17 seconds a store, police station, diner, arcade,
  camper or gas station rolls by with the street. Jump onto its roof (only
  from above; the walls never hurt) for the lights and crates up there. Run
  off the end and you drop back down. Works in the Upside Down too.

## Classes and attacks

| Class | Attack | Why it's fair |
|---|---|---|
| Fighter | Bat, short reach, kills in 1 hit, knocks spore shots back | Riskiest: has to get close |
| Ranger | Slingshot marble lobbed in an arc with gravity: lands at about **half the screen**, hits what it actually touches | Safe but limited range. Longer-bat upgrades and STR throw it further |
| Wizard *(locked)* | Magic bolt straight across the whole screen | Half damage: every enemy takes **2 hits** (the stalker 4) |
| Rogue *(locked)* | Fast melee jabs | 1 in 4 hits is a double-damage crit |

## Score

The high score is one number made of three parts, shown after each run:

- **Distance:** 1 point per metre (×2 in the Upside Down).
- **Combat:** points per kill: flyers (crows, flyers) 10, crawlers (hounds,
  spore pods) 15, walkers (stalkers) 25. ×2 in the Upside Down.
- **Lights:** 5 points per light collected.

## Christmas lights (the currency)

- Bulbs float high (jump for them), alone or in rows of 2–3 that follow the
  arc of a jump, so one well-timed jump collects them all. Upside Down ones
  count double, the rare gold bulb is worth 5.
- **Crates** about every 20 seconds: small (3 lights), medium (5) or big with
  a gold glow (10); big crates get more common the further you run. One in
  four crates holds a heart instead (lights if you're at full health). Hit
  a crate to open it; running into it wastes it.
- **Kills:** enemies sometimes drop a light; the stalker always drops three.
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
| Dark greed | 3 | +0.5× Upside Down multiplier, +1 per Upside Down light |
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

## Art

The game uses the painted pixel art in `assets/`. Anything without art falls
back to a built-in placeholder drawn in `js/sprites.js`.

New art goes through **[ART_PROMPTS.md](ART_PROMPTS.md)**, the complete list
of 137 images. Generate an image, name the file after its key, then run

```
python3 tools/process_art.py <folder with raw PNGs> assets/
```

The script crops, scales and outlines each image and rewrites
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
