# The Upside Down — sprite prompts (players, enemies, street objects, skateboard)

Every frame has its own prompt, ready to paste. Scenery and UI are done, so they're not in this list.

## How to deliver

1. **File name = key**, e.g. `fighter_run3.png`, `hound_attack2.png`. Lowercase, no spaces.
2. Keep ChatGPT's full-size PNG. The game's processor crops and scales it and lines frames up on the hitbox.
3. **Make frame 1 of each set first, then attach it to every following prompt** (the prompts say *"match the attached reference"*). For the players, also attach the class's reference sheet if you have one.
4. Zip the folder (subfolders are fine) and send it.

**Transparency check before you send:** open the PNG in a viewer that shows transparency. You should see your viewer's own background through it, not a painted checkerboard or a black or white box. If ChatGPT paints one in, reply: *"The background is not transparent. Return the same image with a real transparent alpha channel, nothing behind the subject."* (The processor removes plain black, white and checkerboard backgrounds as a safety net, but real transparency gives the cleanest edges.)

**Facing:** players face **right**, enemies face **left**. The game flips everything in the Upside Down, so draw every sprite upright.

**Animation:** the game plays as many frames as you deliver. Missing frames fall back to what's already there.

---

## 1. Players

### Fighter (`fighter_…`, 15 frames)

**`fighter_idle1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Idle, frame 1 of 2: standing relaxed, weight on one leg, breathing in (shoulders slightly raised). OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_idle2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Idle, frame 2 of 2: same standing pose, breathing out (shoulders slightly lowered), everything else identical. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_run1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Running cycle, frame 1 of 4 (contact): right leg reaching forward with the heel touching down, left leg pushing off behind, arms swinging opposite. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_run2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Running cycle, frame 2 of 4 (down): body slightly lower, right leg under the body taking the weight, left leg bending forward. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_run3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Running cycle, frame 3 of 4 (contact): left leg reaching forward with the heel touching down, right leg pushing off behind, arms swinging opposite. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_run4`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Running cycle, frame 4 of 4 (up): body slightly higher, left leg under the body, right knee driving forward. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_jump1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Jump, frame 1 of 2 (rising): knees tucked up, arms reaching up, body leaning slightly forward. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_jump2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Jump, frame 2 of 2 (falling): legs stretching down to land, arms out to the sides for balance. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_roll1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Roll, frame 1 of 4: curled into a tight ball mid-somersault, head at the top. Square image, round silhouette. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_roll2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Roll, frame 2 of 4: the same tight ball turned a quarter turn forward (clockwise), head now on the right. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_roll3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Roll, frame 3 of 4: the same ball turned another quarter, head now at the bottom. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_roll4`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Roll, frame 4 of 4: the same ball turned another quarter, head now on the left. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_attack1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Running attack, frame 1 of 3: running stride, the bat pulled back over the right shoulder ready to swing (wind-up). The legs keep running: never a standing pose. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_attack2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Running attack, frame 2 of 3: mid-stride, the bat swinging forward horizontally at chest height, white motion-line pixels behind it. The legs keep running: never a standing pose. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_attack3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid, a tabletop-RPG nerd: messy brown hair, red zip-up jacket over a striped shirt, blue jeans, white sneakers, a yellow flashlight clipped to the jacket, a dented wooden baseball bat in the right hand, a dented metal trash-can lid strapped to the left arm as a shield. Side view, facing right. Running attack, frame 3 of 3: running follow-through, the bat swept past the front of the body and pointing down-forward, legs still mid-stride. The legs keep running: never a standing pose. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

### Ranger (`ranger_…`, 15 frames)

**`ranger_idle1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Idle, frame 1 of 2: standing relaxed, weight on one leg, breathing in (shoulders slightly raised). OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_idle2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Idle, frame 2 of 2: same standing pose, breathing out (shoulders slightly lowered), everything else identical. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_run1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Running cycle, frame 1 of 4 (contact): right leg reaching forward with the heel touching down, left leg pushing off behind, arms swinging opposite. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_run2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Running cycle, frame 2 of 4 (down): body slightly lower, right leg under the body taking the weight, left leg bending forward. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_run3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Running cycle, frame 3 of 4 (contact): left leg reaching forward with the heel touching down, right leg pushing off behind, arms swinging opposite. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_run4`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Running cycle, frame 4 of 4 (up): body slightly higher, left leg under the body, right knee driving forward. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_jump1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Jump, frame 1 of 2 (rising): knees tucked up, arms reaching up, body leaning slightly forward. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_jump2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Jump, frame 2 of 2 (falling): legs stretching down to land, arms out to the sides for balance. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_roll1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Roll, frame 1 of 4: curled into a tight ball mid-somersault, head at the top. Square image, round silhouette. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_roll2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Roll, frame 2 of 4: the same tight ball turned a quarter turn forward (clockwise), head now on the right. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_roll3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Roll, frame 3 of 4: the same ball turned another quarter, head now at the bottom. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_roll4`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Roll, frame 4 of 4: the same ball turned another quarter, head now on the left. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_attack1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Running attack, frame 1 of 3: running stride, slingshot raised forward in the left hand, the band pulled back to the cheek with the right hand. The legs keep running: never a standing pose. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_attack2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Running attack, frame 2 of 3: mid-stride, releasing the shot: the band snapping forward, a small blue marble just leaving the slingshot with a tiny flash. The legs keep running: never a standing pose. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_attack3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid ranger: freckles, sandy hair under a faded green bucket hat, an olive army-surplus vest with bulging pockets over a yellow T-shirt, brown corduroy shorts, knee socks, hiking boots, a small backpack, a wooden Y-slingshot in the left hand. Side view, facing right. Running attack, frame 3 of 3: running, the slingshot lowering after the shot, band slack, still mid-stride. The legs keep running: never a standing pose. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

### Rogue (`rogue_…`, 15 frames)

**`rogue_idle1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Idle, frame 1 of 2: standing relaxed, weight on one leg, breathing in (shoulders slightly raised). OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_idle2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Idle, frame 2 of 2: same standing pose, breathing out (shoulders slightly lowered), everything else identical. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_run1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Running cycle, frame 1 of 4 (contact): right leg reaching forward with the heel touching down, left leg pushing off behind, arms swinging opposite. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_run2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Running cycle, frame 2 of 4 (down): body slightly lower, right leg under the body taking the weight, left leg bending forward. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_run3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Running cycle, frame 3 of 4 (contact): left leg reaching forward with the heel touching down, right leg pushing off behind, arms swinging opposite. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_run4`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Running cycle, frame 4 of 4 (up): body slightly higher, left leg under the body, right knee driving forward. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_jump1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Jump, frame 1 of 2 (rising): knees tucked up, arms reaching up, body leaning slightly forward. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_jump2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Jump, frame 2 of 2 (falling): legs stretching down to land, arms out to the sides for balance. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_roll1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Roll, frame 1 of 4: curled into a tight ball mid-somersault, head at the top. Square image, round silhouette. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_roll2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Roll, frame 2 of 4: the same tight ball turned a quarter turn forward (clockwise), head now on the right. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_roll3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Roll, frame 3 of 4: the same ball turned another quarter, head now at the bottom. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_roll4`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Roll, frame 4 of 4: the same ball turned another quarter, head now on the left. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_attack1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Running attack, frame 1 of 3: low fast running stride, the flashlight drawn back at the hip (wind-up). The legs keep running: never a standing pose. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_attack2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Running attack, frame 2 of 3: mid-stride lunge, the flashlight thrust forward with a bright white strobe flash burst at its tip. The legs keep running: never a standing pose. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_attack3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid rogue: dark grey zip hoodie with the hood up, black hair poking out, a chunky 1980s walkie-talkie clipped to the chest with its antenna up, black jeans, beat-up canvas high-tops, fingerless gloves, a small metal flashlight in the right hand, sly grin. Side view, facing right. Running attack, frame 3 of 3: running, pulling the flashlight back, the last white sparks fading in front. The legs keep running: never a standing pose. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

### Wizard (`wizard_…`, 15 frames)

**`wizard_idle1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Idle, frame 1 of 2: standing relaxed, weight on one leg, breathing in (shoulders slightly raised). OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_idle2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Idle, frame 2 of 2: same standing pose, breathing out (shoulders slightly lowered), everything else identical. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_run1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Running cycle, frame 1 of 4 (contact): right leg reaching forward with the heel touching down, left leg pushing off behind, arms swinging opposite. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_run2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Running cycle, frame 2 of 4 (down): body slightly lower, right leg under the body taking the weight, left leg bending forward. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_run3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Running cycle, frame 3 of 4 (contact): left leg reaching forward with the heel touching down, right leg pushing off behind, arms swinging opposite. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_run4`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Running cycle, frame 4 of 4 (up): body slightly higher, left leg under the body, right knee driving forward. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_jump1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Jump, frame 1 of 2 (rising): knees tucked up, arms reaching up, body leaning slightly forward. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_jump2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Jump, frame 2 of 2 (falling): legs stretching down to land, arms out to the sides for balance. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_roll1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Roll, frame 1 of 4: curled into a tight ball mid-somersault, head at the top. Square image, round silhouette. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_roll2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Roll, frame 2 of 4: the same tight ball turned a quarter turn forward (clockwise), head now on the right. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_roll3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Roll, frame 3 of 4: the same ball turned another quarter, head now at the bottom. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_roll4`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Roll, frame 4 of 4: the same ball turned another quarter, head now on the left. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_attack1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Running attack, frame 1 of 3: running stride, the wand raised overhead, small violet sparks gathering at its tip, cape flowing behind. The legs keep running: never a standing pose. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_attack2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Running attack, frame 2 of 3: mid-stride, the wand thrust forward and a glowing violet twenty-sided die launching from its tip. The legs keep running: never a standing pose. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_attack3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: an original 12-year-old kid wizard: a cape made from a striped bedsheet tied at the neck, a cardboard cone hat with tinfoil stars, round glasses, curly red hair, a knitted sweater, a wand made from a painted stick, a cloth pouch of RPG dice on the belt. Side view, facing right. Running attack, frame 3 of 3: running, the wand lowering, a short trail of violet sparks in front, cape billowing. The legs keep running: never a standing pose. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. Full body visible, about 80% of the image height, feet on the same baseline as the other frames. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

---

## 2. Enemies

### Crow (`crow_…`, 6 frames)

**`crow_fly1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: a sickly black crow with one glowing white eye, ragged feathers, yellow beak, flying, side view facing LEFT. Original design, not copied from any show, film or game. Flying, frame 1 of 4: wings fully up. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`crow_fly2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: a sickly black crow with one glowing white eye, ragged feathers, yellow beak, flying, side view facing LEFT. Original design, not copied from any show, film or game. Flying, frame 2 of 4: wings level, spread out. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`crow_fly3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: a sickly black crow with one glowing white eye, ragged feathers, yellow beak, flying, side view facing LEFT. Original design, not copied from any show, film or game. Flying, frame 3 of 4: wings fully down. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`crow_fly4`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: a sickly black crow with one glowing white eye, ragged feathers, yellow beak, flying, side view facing LEFT. Original design, not copied from any show, film or game. Flying, frame 4 of 4: wings level, folding up. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`crow_attack1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: a sickly black crow with one glowing white eye, ragged feathers, yellow beak, flying, side view facing LEFT. Original design, not copied from any show, film or game. Attack, frame 1 of 2: diving forward, wings swept back, beak open, talons forward. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`crow_attack2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: a sickly black crow with one glowing white eye, ragged feathers, yellow beak, flying, side view facing LEFT. Original design, not copied from any show, film or game. Attack, frame 2 of 2: lunging bite, head thrust forward, wings flared. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

### Hound (Upside Down) (`hound_…`, 8 frames)

**`hound_run1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original lean, hairless four-legged predator from a dark parallel world, side view facing LEFT: ash-grey hide stretched over visible ribs, a bony ridge down the spine, long thin legs with hooked black claws, a whip-thin tail, a long narrow eyeless skull with a lipless snarl of needle-like teeth and two small glowing red pits on the snout. Original design, not copied from any show, film or game. Running cycle, frame 1 of 4: front legs reaching far forward, back legs stretched behind (full extension). OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`hound_run2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original lean, hairless four-legged predator from a dark parallel world, side view facing LEFT: ash-grey hide stretched over visible ribs, a bony ridge down the spine, long thin legs with hooked black claws, a whip-thin tail, a long narrow eyeless skull with a lipless snarl of needle-like teeth and two small glowing red pits on the snout. Original design, not copied from any show, film or game. Running cycle, frame 2 of 4: front paws landing, back legs swinging forward. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`hound_run3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original lean, hairless four-legged predator from a dark parallel world, side view facing LEFT: ash-grey hide stretched over visible ribs, a bony ridge down the spine, long thin legs with hooked black claws, a whip-thin tail, a long narrow eyeless skull with a lipless snarl of needle-like teeth and two small glowing red pits on the snout. Original design, not copied from any show, film or game. Running cycle, frame 3 of 4: all four legs gathered under the body (full contraction), spine arched. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`hound_run4`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original lean, hairless four-legged predator from a dark parallel world, side view facing LEFT: ash-grey hide stretched over visible ribs, a bony ridge down the spine, long thin legs with hooked black claws, a whip-thin tail, a long narrow eyeless skull with a lipless snarl of needle-like teeth and two small glowing red pits on the snout. Original design, not copied from any show, film or game. Running cycle, frame 4 of 4: back legs pushing off, front legs lifting. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`hound_jump1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original lean, hairless four-legged predator from a dark parallel world, side view facing LEFT: ash-grey hide stretched over visible ribs, a bony ridge down the spine, long thin legs with hooked black claws, a whip-thin tail, a long narrow eyeless skull with a lipless snarl of needle-like teeth and two small glowing red pits on the snout. Original design, not copied from any show, film or game. Pounce, frame 1 of 2 (rising): leaping up and forward, front claws reaching out, jaws wide open. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`hound_jump2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original lean, hairless four-legged predator from a dark parallel world, side view facing LEFT: ash-grey hide stretched over visible ribs, a bony ridge down the spine, long thin legs with hooked black claws, a whip-thin tail, a long narrow eyeless skull with a lipless snarl of needle-like teeth and two small glowing red pits on the snout. Original design, not copied from any show, film or game. Pounce, frame 2 of 2 (falling): coming down, front legs stretched to land, back legs tucked. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`hound_attack1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original lean, hairless four-legged predator from a dark parallel world, side view facing LEFT: ash-grey hide stretched over visible ribs, a bony ridge down the spine, long thin legs with hooked black claws, a whip-thin tail, a long narrow eyeless skull with a lipless snarl of needle-like teeth and two small glowing red pits on the snout. Original design, not copied from any show, film or game. Attack, frame 1 of 2: braking hard, head pulled back, jaws opening. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`hound_attack2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original lean, hairless four-legged predator from a dark parallel world, side view facing LEFT: ash-grey hide stretched over visible ribs, a bony ridge down the spine, long thin legs with hooked black claws, a whip-thin tail, a long narrow eyeless skull with a lipless snarl of needle-like teeth and two small glowing red pits on the snout. Original design, not copied from any show, film or game. Attack, frame 2 of 2: snapping bite, head thrust forward, jaws wide. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

### Stalker (Upside Down) (`stalker_…`, 7 frames)

**`stalker_walk1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original tall, gaunt, hunched humanoid creature from a dark parallel world, side view facing LEFT: wrinkled pale grey-violet hide with dark crimson veins, very long arms hanging past the knees ending in long hooked claws, digitigrade legs, a small head low between the shoulders crowned with a tangle of black root-like antlers, a narrow shadowed face with two pinpoint glowing red eyes, a ragged mane of dark vines down its back. Original design, not copied from any show, film or game. Walking cycle, frame 1 of 4: left leg forward, right arm swinging forward, long claws dangling. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`stalker_walk2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original tall, gaunt, hunched humanoid creature from a dark parallel world, side view facing LEFT: wrinkled pale grey-violet hide with dark crimson veins, very long arms hanging past the knees ending in long hooked claws, digitigrade legs, a small head low between the shoulders crowned with a tangle of black root-like antlers, a narrow shadowed face with two pinpoint glowing red eyes, a ragged mane of dark vines down its back. Original design, not copied from any show, film or game. Walking cycle, frame 2 of 4: legs passing, body at its lowest, arms hanging. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`stalker_walk3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original tall, gaunt, hunched humanoid creature from a dark parallel world, side view facing LEFT: wrinkled pale grey-violet hide with dark crimson veins, very long arms hanging past the knees ending in long hooked claws, digitigrade legs, a small head low between the shoulders crowned with a tangle of black root-like antlers, a narrow shadowed face with two pinpoint glowing red eyes, a ragged mane of dark vines down its back. Original design, not copied from any show, film or game. Walking cycle, frame 3 of 4: right leg forward, left arm swinging forward. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`stalker_walk4`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original tall, gaunt, hunched humanoid creature from a dark parallel world, side view facing LEFT: wrinkled pale grey-violet hide with dark crimson veins, very long arms hanging past the knees ending in long hooked claws, digitigrade legs, a small head low between the shoulders crowned with a tangle of black root-like antlers, a narrow shadowed face with two pinpoint glowing red eyes, a ragged mane of dark vines down its back. Original design, not copied from any show, film or game. Walking cycle, frame 4 of 4: legs passing, body at its highest. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`stalker_attack1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original tall, gaunt, hunched humanoid creature from a dark parallel world, side view facing LEFT: wrinkled pale grey-violet hide with dark crimson veins, very long arms hanging past the knees ending in long hooked claws, digitigrade legs, a small head low between the shoulders crowned with a tangle of black root-like antlers, a narrow shadowed face with two pinpoint glowing red eyes, a ragged mane of dark vines down its back. Original design, not copied from any show, film or game. Attack, frame 1 of 3: rearing up, one long arm raised high with claws spread (wind-up). Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`stalker_attack2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original tall, gaunt, hunched humanoid creature from a dark parallel world, side view facing LEFT: wrinkled pale grey-violet hide with dark crimson veins, very long arms hanging past the knees ending in long hooked claws, digitigrade legs, a small head low between the shoulders crowned with a tangle of black root-like antlers, a narrow shadowed face with two pinpoint glowing red eyes, a ragged mane of dark vines down its back. Original design, not copied from any show, film or game. Attack, frame 2 of 3: the raised arm slashing down and forward, white claw-slash lines. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`stalker_attack3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original tall, gaunt, hunched humanoid creature from a dark parallel world, side view facing LEFT: wrinkled pale grey-violet hide with dark crimson veins, very long arms hanging past the knees ending in long hooked claws, digitigrade legs, a small head low between the shoulders crowned with a tangle of black root-like antlers, a narrow shadowed face with two pinpoint glowing red eyes, a ragged mane of dark vines down its back. Original design, not copied from any show, film or game. Attack, frame 3 of 3: follow-through, the arm swept low in front, body hunched forward. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

### Flyer (Upside Down) (`flyer_…`, 6 frames)

**`flyer_fly1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original small flying creature from a dark parallel world, side view facing LEFT: a moth-like body covered in dusky grey fuzz, two big tattered wings with dark violet membranes and glowing crimson veins, a long whip-like tail with a barb, two red eyes, a small hooked mouth. Original design, not copied from any show, film or game. Flying, frame 1 of 4: wings fully up. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`flyer_fly2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original small flying creature from a dark parallel world, side view facing LEFT: a moth-like body covered in dusky grey fuzz, two big tattered wings with dark violet membranes and glowing crimson veins, a long whip-like tail with a barb, two red eyes, a small hooked mouth. Original design, not copied from any show, film or game. Flying, frame 2 of 4: wings level. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`flyer_fly3`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original small flying creature from a dark parallel world, side view facing LEFT: a moth-like body covered in dusky grey fuzz, two big tattered wings with dark violet membranes and glowing crimson veins, a long whip-like tail with a barb, two red eyes, a small hooked mouth. Original design, not copied from any show, film or game. Flying, frame 3 of 4: wings fully down. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`flyer_fly4`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original small flying creature from a dark parallel world, side view facing LEFT: a moth-like body covered in dusky grey fuzz, two big tattered wings with dark violet membranes and glowing crimson veins, a long whip-like tail with a barb, two red eyes, a small hooked mouth. Original design, not copied from any show, film or game. Flying, frame 4 of 4: wings level, rising. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`flyer_attack1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original small flying creature from a dark parallel world, side view facing LEFT: a moth-like body covered in dusky grey fuzz, two big tattered wings with dark violet membranes and glowing crimson veins, a long whip-like tail with a barb, two red eyes, a small hooked mouth. Original design, not copied from any show, film or game. Attack, frame 1 of 2: diving forward, wings folded back, tail barb raised. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`flyer_attack2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original small flying creature from a dark parallel world, side view facing LEFT: a moth-like body covered in dusky grey fuzz, two big tattered wings with dark violet membranes and glowing crimson veins, a long whip-like tail with a barb, two red eyes, a small hooked mouth. Original design, not copied from any show, film or game. Attack, frame 2 of 2: striking, tail barb whipping forward over its head, mouth open. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

### Spore pod (Upside Down) (`pod_…`, 4 frames)

**`pod_idle1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: a pulsing fleshy spore pod rooted in the ground, crimson and magenta, short root tendrils at the base, two small glowing eyes, side view facing LEFT. Original design, not copied from any show, film or game. Idle, frame 1 of 2: pod slightly swollen, mouth closed. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`pod_idle2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: a pulsing fleshy spore pod rooted in the ground, crimson and magenta, short root tendrils at the base, two small glowing eyes, side view facing LEFT. Original design, not copied from any show, film or game. Idle, frame 2 of 2: pod slightly shrunk (breathing), mouth closed. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`pod_attack1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: a pulsing fleshy spore pod rooted in the ground, crimson and magenta, short root tendrils at the base, two small glowing eyes, side view facing LEFT. Original design, not copied from any show, film or game. Attack, frame 1 of 2: pod swelling up, mouth starting to open, glowing pink inside. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`pod_attack2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: a pulsing fleshy spore pod rooted in the ground, crimson and magenta, short root tendrils at the base, two small glowing eyes, side view facing LEFT. Original design, not copied from any show, film or game. Attack, frame 2 of 2: mouth wide open, spitting a glowing pink spore to the LEFT. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

### Projectiles (3)

**`shot_spore`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Object: a tiny glowing pink spore ball with a short trail to the left (fired by the spore pod). Tiny, simple, bold. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_shot`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Object: a single glowing blue marble with a short motion trail to the left (the Ranger's slingshot shot). Tiny, simple, bold. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_d20`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Object: a small glowing violet twenty-sided die with a sparkle trail to the left (the Wizard's spell). Tiny, simple, bold. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

---

## 3. The Watcher: background creature in the Upside Down sky (2 images)

Not an enemy: it rises far away in the Upside Down sky now and then. It's barely visible until lightning lights it up. The game sways the **head** from side to side and bobs the whole creature, so it comes as **two separate pieces**. It should read as a dark silhouette with only a faint crimson rim light.

**`watcher_body`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: an original colossal creature from a dark parallel world, seen from far away as a towering silhouette: a body made of twisted black roots and drifting storm smoke, two very long branch-like arms with twig claws reaching out to the sides, the bottom fading into smoke and roots. Front view. Draw the body WITHOUT a head: the neck ends flat and centred at the very top of the image, so a separate head can sit on it. Almost black (#14060c) with a thin dull-crimson rim light, very little detail, soft smoky edges made of pixel clusters. Original design, not copied from any show, film or game. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`watcher_head`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Creature: the head of the colossal root-and-smoke giant in the attached image. A long narrow skull, front view, crowned with huge branching black antlers like dead trees, two tiny glowing red eyes, a short neck stump centred at the very bottom of the image. Same near-black colour with a thin dull-crimson rim light. Match the attached reference exactly: same creature, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

---

---

## 4. Street objects you can jump on (12)

These roll by with the street at real size. Kids jump onto them, so **the top outline is the surface they stand on**: keep roofs clean, no antennas, ladders or bars sticking up (the police car's light bar is fine). Draw them **upright**; the game flips the Upside Down versions. Make the normal version first, then attach it for the `_dark` one.

**`plat_dumpster`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Object: a green metal street dumpster with a closed flat lid, a bit dented, side view, the long side facing the viewer. Flat side view, no perspective, wheels touching the bottom edge of the image. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`plat_dumpster_dark`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Use the attached image: the exact same object, same size, same outline and silhouette, but rotten in a dark parallel world: dusty purple and crimson colours, black vines creeping over it, dull red glow in the windows, rust and spores. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`plat_car`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Object: a boxy 1980s American sedan, faded red paint, chrome bumpers, side view with the FRONT of the car on the LEFT. Flat side view, no perspective, wheels touching the bottom edge of the image. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`plat_car_dark`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Use the attached image: the exact same object, same size, same outline and silhouette, but rotten in a dark parallel world: dusty purple and crimson colours, black vines creeping over it, dull red glow in the windows, rust and spores. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`plat_cop`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Object: a 1980s small-town police car, white with a dark stripe, a light bar on the roof, side view with the FRONT on the LEFT. Flat side view, no perspective, wheels touching the bottom edge of the image. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`plat_cop_dark`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Use the attached image: the exact same object, same size, same outline and silhouette, but rotten in a dark parallel world: dusty purple and crimson colours, black vines creeping over it, dull red glow in the windows, rust and spores. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`plat_van`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Object: a 1980s cream-coloured passenger van with side windows, side view with the FRONT on the LEFT. Flat side view, no perspective, wheels touching the bottom edge of the image. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`plat_van_dark`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Use the attached image: the exact same object, same size, same outline and silhouette, but rotten in a dark parallel world: dusty purple and crimson colours, black vines creeping over it, dull red glow in the windows, rust and spores. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`plat_pickup`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Object: a 1980s blue pickup truck with an open bed at the back, side view with the FRONT on the LEFT. Flat side view, no perspective, wheels touching the bottom edge of the image. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`plat_pickup_dark`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Use the attached image: the exact same object, same size, same outline and silhouette, but rotten in a dark parallel world: dusty purple and crimson colours, black vines creeping over it, dull red glow in the windows, rust and spores. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`plat_bus`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Object: a yellow 1980s school bus, long, with a row of windows, side view with the FRONT on the LEFT. Flat side view, no perspective, wheels touching the bottom edge of the image. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`plat_bus_dark`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Use the attached image: the exact same object, same size, same outline and silhouette, but rotten in a dark parallel world: dusty purple and crimson colours, black vines creeping over it, dull red glow in the windows, rust and spores. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

---

## 5. Skateboard power-up

Unlocked in the upgrade shop. Like a star power-up: grab the board and you ride through everything, invincible, for a few seconds.

**`pickup_skate`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Object: a 1980s skateboard seen from the side, tilted slightly upward, bright red deck with a yellow lightning bolt, chunky white wheels, a few rainbow sparkle pixels around it. Wide image. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`skate_board`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Object: the same skateboard as attached, perfectly flat side view, wheels down, no sparkles. Very wide and thin image (about 4:1). OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ui_up_skate`**

```
Pixel-art game UI icon, crisp pixels, no anti-aliasing, flat front view. A red skateboard with a yellow lightning bolt and rainbow motion lines on a dark violet rounded tile, square. FULLY TRANSPARENT BACKGROUND outside the tile, no text.
```

Riding frames, 2 per class (optional: without them the game shows a run frame standing on the board). Attach the class reference and the skateboard.

**`fighter_skate1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: the Fighter kid (red jacket, bat, trash-can lid), side view facing right, standing on the attached skateboard, crouched low on the skateboard, arms out for balance, hair and clothes blown back by the wind. The board's wheels touch the bottom edge of the image. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`fighter_skate2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: the Fighter kid (red jacket, bat, trash-can lid), side view facing right, standing on the attached skateboard, leaning into the ride, one fist pumped forward, big grin, clothes blown back. The board's wheels touch the bottom edge of the image. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_skate1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: the Ranger kid (bucket hat, vest, slingshot), side view facing right, standing on the attached skateboard, crouched low on the skateboard, arms out for balance, hair and clothes blown back by the wind. The board's wheels touch the bottom edge of the image. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`ranger_skate2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: the Ranger kid (bucket hat, vest, slingshot), side view facing right, standing on the attached skateboard, leaning into the ride, one fist pumped forward, big grin, clothes blown back. The board's wheels touch the bottom edge of the image. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_skate1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: the Rogue kid (grey hoodie, walkie-talkie), side view facing right, standing on the attached skateboard, crouched low on the skateboard, arms out for balance, hair and clothes blown back by the wind. The board's wheels touch the bottom edge of the image. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`rogue_skate2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: the Rogue kid (grey hoodie, walkie-talkie), side view facing right, standing on the attached skateboard, leaning into the ride, one fist pumped forward, big grin, clothes blown back. The board's wheels touch the bottom edge of the image. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_skate1`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: the Wizard kid (bedsheet cape, cardboard hat), side view facing right, standing on the attached skateboard, crouched low on the skateboard, arms out for balance, hair and clothes blown back by the wind. The board's wheels touch the bottom edge of the image. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

**`wizard_skate2`**

```
16-bit pixel art sprite for a 2D side-scrolling runner, crisp hard-edged pixels, bold saturated colours, dark 1-pixel outline (#1a1124), 1980s small-town horror mood. Character: the Wizard kid (bedsheet cape, cardboard hat), side view facing right, standing on the attached skateboard, leaning into the ride, one fist pumped forward, big grin, clothes blown back. The board's wheels touch the bottom edge of the image. Match the attached reference exactly: same character, same proportions, same palette, same pixel size. OUTPUT: one PNG, FULLY TRANSPARENT BACKGROUND (RGBA with a real alpha channel). Subject centred. No background, no scenery, no floor, no ground shadow, no checkerboard pattern, no black or white fill, no text, no frame or border. Sharp, hard pixel edges, no anti-aliasing, no blur, no glow halo.
```

---

## Checklist

| Set | Files |
|---|---|
| Fighter, Ranger, Rogue, Wizard | 4 × 15 = 60 |
| Crow 6, Hound 8, Stalker 7, Flyer 6, Spore pod 4 | 31 |
| Projectiles | 3 |
| The Watcher | 2 |
| Street objects to jump on (6 + 6 dark) | 12 |
| Skateboard: pickup, board, upgrade icon, 2 riding frames × 4 classes | 11 |
| **Total** | **119** |

Per player class: idle 2, run 4, jump 2 (rising, falling), roll 4, running attack 3 (+ 2 optional skateboard frames).
