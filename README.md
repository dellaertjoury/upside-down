# THE UPSIDE DOWN

An endless pixel-art runner inspired by the dino game Chrome shows when you're
offline, with one twist: the floor has two sides. The top half is a quiet
suburban street. The bottom half is the **Upside Down**. Flip through the floor
to dodge whatever blocks your side.

Every run starts at the door of the **Hellfire Club**, the D&D group's hangout.
Roll up a character sheet there, then head out.

Plain HTML + JavaScript. No build step, no dependencies.

## Play

- **Online:** enable GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).
  The game is then live at `https://<your-user>.github.io/<repo>/`.
- **Locally:** `python3 -m http.server` in this folder, then open http://localhost:8000.
  (Opening `index.html` directly works too, but PNG art overrides need a server.)

## Controls

| Action | Keyboard | Touch |
|---|---|---|
| Jump (double jump with upgrade) | ↑ | Jump button or swipe up |
| Roll (duck under things) | ↓ | Roll button or swipe down |
| Melee hit (bat) | → | Hit button or swipe right |
| Block (trash-can lid) | ← | Block button or swipe left |
| Flip to the other side | Space | Flip button or tap |
| Pause | P / Esc | |

W/A/S/D work as alternates for the arrows. In the air, Roll and Flip do a
fast-fall first, then trigger on landing.

**Block:** blocking an enemy as it touches you parries it (+25 points). Block in
the first instant and it's a **PERFECT** parry (+50). Blocking a spore shot
reflects it back, killing whatever it hits. Blocking doesn't stop obstacles.

## Character sheet (D&D style)

Roll **4d6, drop the lowest** for each ability. You get 3 free rerolls, then
each reroll costs 10 shards. Pick a class (Fighter for now: STR +2, CON +1;
Ranger, Rogue and Wizard are placeholders) and a hair and jacket colour.

| Ability | In game |
|---|---|
| STR | Bat reach |
| DEX | Jump height and block window |
| CON | Extra hearts (+1 per +2 modifier) |
| INT | Bigger shard bonus after each run |
| WIS | Longer in the Upside Down before the Dread throws you out |
| CHA | Shard magnet range |

**D20 fate:** each run opens with a d20 roll. A natural 20 gives +1 heart, 15–19
gives +20% score, 2–5 fills Dread 15% faster, and a natural 1 fills it 30% faster.

## Rules

- You run automatically and get faster over time.
- **Obstacles:** low ones you jump, hanging ones you roll under, enemies you
  hit or parry, spore pods shoot along the ground (block to reflect), and
  **walls** block a whole side, so you have to flip.
- **The Upside Down** scores at ×2 (more with upgrades) and drops spores worth
  3 shards each. But the **Dread** meter fills while you're down there. When
  it's full you get thrown back up and can't flip again for a moment.
- **Shards** are banked at the end of every run (plus a bonus of 1 per 250
  score, or better with high INT). Spend them on permanent upgrades between runs. That's the roguelike loop.

## Upgrades

| Upgrade | Levels | Effect |
|---|---|---|
| Extra heart | 3 | +1 hit per run |
| Longer bat | 3 | +6 px melee reach |
| Flashlight battery | 4 | +2 s in the Upside Down |
| Shard magnet | 3 | Bigger pickup radius |
| Dark greed | 3 | +0.5× Upside Down multiplier, +1 shard per spore |
| Sturdier lid | 2 | Block lasts longer |
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

## Art

Every sprite is a built-in placeholder drawn from text maps in `js/sprites.js`.
To use real art, follow **[ART_PROMPTS.md](ART_PROMPTS.md)**: generate a PNG,
drop it in `assets/`, and add its key to `assets/manifest.json`.

## Project layout

```
index.html          menus + canvas
css/style.css       arcade-cabinet styling
js/config.js        optional Supabase keys
js/sprites.js       pixel sprites, procedural backgrounds, PNG overrides
js/audio.js         chiptune sound effects (WebAudio, no files)
js/save.js          progress, character sheet, dice, upgrades
js/leaderboard.js   claude / supabase / local leaderboard
js/game.js          the game: physics, spawning, collisions, rendering
js/ui.js            hub, character sheet and other menus
assets/             your PNG art + manifest.json
```

## Adding classes later

Classes live in `CLASSES` in `js/save.js`. Set `locked: false` and give a class
its own ability bonus; new class-specific moves go in `js/game.js`.

---
A fan project inspired by a TV series. The characters, monsters, emblem and
all art in this repo are original; no logos from the show are used.
