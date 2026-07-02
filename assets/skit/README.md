# Skit images — "New Employee Orientation"

**Status: all 12 scenes + the `lick` easter egg are in.** The `.png` files are the source art;
the site ships the compressed `.jpg` versions (1600px wide, ~400KB each, generated with Pillow:
resize to 1600w, JPEG quality 82, progressive). If you replace a PNG, regenerate its JPG the same way.

The engine loads `sceneN.jpg`. If a file is missing, the stage shows a labelled placeholder
describing the shot, so the skit stays playable.

- **Format:** `.jpg` (landscape). Aim ~1600×900 (16:9). The stage crops to fill, so keep
  the action roughly centred and leave headroom at the **bottom** (the speech bubble sits there).
- **Recurring host:** every scene features **BRENDA** — a beaming corporate host in a blazer
  with a FIFA-style lanyard. Try to keep her look consistent scene to scene.
- **Style tip:** bright, cheerful, corporate-cartoon / satirical illustration — the humour is the
  gap between how *upbeat* it looks and how *grim* the content is. Avoid real people's likenesses.

| File | Scene | Shot |
|------|-------|------|
| `scene0.jpg`  | Welcome | Bright gleaming FIFA HQ lobby (gold & green). Brenda, arms thrown wide in welcome, lanyard on. |
| `scene1.jpg`  | The Sky | Rooftop helipad crowded with private jets under a smoggy orange sky; one sad wilting potted plant. Brenda gesturing proudly at the jets. |
| `scene2.jpg`  | The Bill | Office where a giant paper invoice unspools across the floor; a golden cash register. Brenda fanning a wad of cash. |
| `scene3.jpg`  | The House | Bank vault of gold bars under a big "NON-PROFIT ✔" banner. Brenda winking, finger to her lips. |
| `scene4.jpg`  | The Sponsors | Press-conference sponsor wall of invented logos (oil drop, airplane, soda cup). Brenda presenting like a game-show host. |
| `scene5.jpg`  | The Cleanup | A giant broom sweeping tents & a shopping cart off a spotless "FIFA Fan Zone" street. Brenda cheerfully holding the broom. |
| `scene6.jpg`  | The Workers | Blazing-hot stadium concourse; an exhausted worker sweating at a beer tap under a huge sun. Brenda in sunglasses with an iced drink. |
| `scene7.jpg`  | The Watchers | Turnstiles bristling with cameras; a green face-scan grid over a nervous fan. Brenda giving two thumbs up. |
| `scene8.jpg`  | The Rap Sheet | Wall of blurred generic mugshots beside a 2015 newspaper ("FIFA ARRESTS"). Brenda shrugging with exaggerated innocence. |
| `scene9.jpg`  | The President | Gold throne beside a private jet, a framed portrait of a smug *generic* executive. Brenda gazing up adoringly. |
| `scene10.jpg` | The League | Cheery amusement-park map of North America dotted with 16 little flags. Brenda pointing with a ruler. |
| `scene11.jpg` | Wrap | Confetti over the FIFA lobby; Brenda handing you a swag bag. A scoreboard behind reads FIFA 10 – 0. |

The exact dialogue/SFX for each scene lives in `js/data.js` → `SKIT` if you want to tweak the script.
