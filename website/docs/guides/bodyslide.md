---
sidebar_position: 2
title: "Bodyslide Guide 👚"
hide_title: true
slug: /guides/bodyslide
description: "How BodySlide is built in Licentia NEXT Skyrim modlist, and how to build outfits you add yourself"
image: ./img/bodyslide-guide-social.png
---

# <span className="licentia-heading licentia-heading--h1">Bodyslide Guide</span>
---

# 👚 BodySlide in Licentia NEXT

:::note
**WHY YOU MIGHT NEED THIS?**

You want to **re-build** the list's BodySlide output (after changing presets, updating an outfit mod, or just to be sure it's fresh) - see [Part 1](#part-1--re-running-the-lists-bodyslide-build-bsbb).

You **added an outfit, armor or body mod** that ships BodySlide files, and it looks wrong or invisible in game - see [Part 2](#part-2--building-outfits-you-added-yourself).
:::

:::warning
**Licentia NEXT `13.7.0` changed how BodySlide is built.** The list no longer asks you to pick groups and batch build by hand - it uses **BSBB (MO2 BodySlide Batch Builder)**, which rebuilds everything from a ready-made config in one click. If you followed this guide before `13.7.0`, the old steps (choosing `3BA`/`HIMBO` groups, building `Unassigned` outfits by hand, a single `Bodyslide Output` mod) **no longer apply**.
:::

---

## 🤓 How BodySlide is set up in Licentia NEXT

Licentia NEXT uses **OBody NG**, which gives every NPC a body shape at runtime. Because OBody does the shaping, every mesh BodySlide builds must be **neutral** - built on a zeroed preset. That's why you should never build the list's outfits with your favourite preset.

| Body | Naked body we use | Preset to build everything with |
|---|---|---|
| Female | CBBE 3BBB Body Amazing | `- Zeroed Sliders -` |
| Male | HIMBO Body - SOS High Poly Phys CBPC | `HIMBO Zero for OBody` |

The output is split across **four mods**, at the very bottom of the MO2 left pane under the `Licentia NEXT - Bodyslide Output - Needs to always stay at the end` separator:

| Build | Output mod | Body | What it builds |
|---|---|---|---|
| 1 | `Licentia NEXT - BO 1 - 3BA - All` | Female | Every female outfit reachable through BodySlide groups |
| 2 | `Licentia NEXT - BO 2 - HIMBO - All` | Male | Every male outfit reachable through BodySlide groups |
| 3 | `Licentia NEXT - BO 3 - 3BA - Unassigned` | Female | Female outfits whose author put them in **no** group *(Heart of Ice, LotD `Dbm` outfits, the TRX futa addon, Dismemberment Framework addons, etc.)* |
| 4 | `Licentia NEXT - BO 4 - HIMBO - Unassigned` | Male | The male equivalent |

Next to them sits `Licentia NEXT - BSBB Groups config`, which holds the slider groups BSBB generates. Don't edit it by hand.

:::danger
**Never put your own files into the four `BO` mods.** Every BSBB build **wipes its output mod first**, so anything you add there is deleted on the next rebuild. Your own builds go into your own mod - see [Part 2](#part-2--building-outfits-you-added-yourself).
:::

---

## Part 1 &mdash; Re-running the list's BodySlide build (BSBB)

:::tip
:clock1: A full rebuild takes around 5 minutes, and you don't have to click through anything while it runs.
:::

### Step :one: &mdash; Close the game

MO2 builds its virtual `Data` folder when you launch something, so meshes written while the game is running won't be seen until the next launch. Close Skyrim before building.

### Step :two: &mdash; Open BSBB

In `MO2`, click the **Tools** icon (the puzzle piece in the top toolbar) and select **`BodySlide Batch Builder`**.

<DocImage
    src={require('./img/bodyslide_guide/1_run_BBSB.png').default}
    alt="Run BSBB"
    style={{ maxHeight:250 }}
    width={807}
    height={415}
/>

The window would open listing the four builds with their output mod and preset.

:::note
The **`Output`** and **`Preset`** column headers in the BSBB window are **swapped** - that's a display bug in BSBB itself. The config is fine, don't try to "fix" it.
:::

### Step :three: &mdash; Click `Build All`

In the opened window click `Build All` at the top right:

<DocImage
    src={require('./img/bodyslide_guide/2_BBSB_build_all.png').default}
    alt="Build All in BSBB"
    style={{ maxHeight:250 }}
    width={1486}
    height={799}
/>

BSBB launches BodySlide (the MO2 executable named `BodySlide`) once per build, with the right preset and output mod each time, and **Build Morphs** is always on. BodySlide closes itself after each batch.

- To rebuild only part of it, untick the builds you don't need - but note that **the ticked state is saved into the config**, so tick them back afterwards.
- If BSBB reports a **conflict** (two slider sets writing the same mesh) or **ignored** outfits, it's telling you the config doesn't know how to handle something new - usually a mod you added. Don't build over it; see [Part 2](#part-2--building-outfits-you-added-yourself).

### Step :four: &mdash; Refresh MO2 and start the game

Hit `F5` in MO2 when BSBB finishes, then launch the game. **That's it!** :crown:

<details>
<summary>:information_source: How the list's rules work (for the curious)</summary>

The config lives at `<Licentia folder>\plugins\data\bsbb_config.xml`. It decides, for every mesh, **which slider set builds it** - many outfits exist in several versions (physics / no physics, CBBE / 3BA, heels / no heels, old / new conversion), and they all write to the same mesh file.

- **Excludes come first.** Outfits that belong to another build (a male path in a female build, an amulet owned by a dedicated mod) are removed before anything else.
- **Then preferences, top to bottom.** When several slider sets want the same mesh, BSBB walks the rules in order and keeps the first match. The order is the whole mechanism - specific rules sit above general ones.
- Female build, in short: specific fixes first (Immersive Armors: Asdasfa's fixes > IAR ports > the old IA conversion), then `CBBE 3BA Vanilla Outfits Redone` and the Creation Club outfits (**physics variants preferred**), then mod-specific 3BA conversions, then generic `3BA` / `3BBB`, and plain `CBBE` only as a last resort. **No heels** variants are preferred.
- Male build, in short: specific HIMBO refits first (Immersive Armors, Vigilant, Kaidan, LotD, Wyrmstooth, Creation Club, base game), then the HIMBO bodies, `TNG`, and `HIMBO` as the catch-all. Variants without skirt bones, and the `SOS High Poly` body, are preferred.
- **Every mesh is built by exactly one build**, so a male build can never overwrite a female mesh and MO2 priority between the `BO` mods never has to decide anything.

Some outfits are intentionally left as their authors made them - for example the Thieves Guild armour has no breast physics in `CBBE 3BA Vanilla Outfits Redone`, and a few outfits (Savior's Hide among them) crumple slightly under large breast sliders because of upstream slider data. Those are known and not bugs in your install.
</details>

---

## Part 2 &mdash; Building outfits you added yourself

You installed a new armor or outfit mod that ships BodySlide files (`CalienteTools\BodySlide\SliderSets\*.osp`). BSBB doesn't know about it, so you build it yourself - into **your own output mod**, which sits below the list's four.

:::tip
:clock1: A couple of minutes per outfit mod.
:::

### Step :one: &mdash; Create your own output mod (once)

At the top of the _Mod Organizer 2_ window, on the icon row next to Profile, click the Wrench and Screwdriver icon and select `Create Empty Mod`.

<DocImage
    src={require('./img/bodyslide_guide/1_empty_mod.png').default}
    alt="Create an Empty Mod for your own BodySlide output"
    style={{ maxHeight:300 }}
    width={380}
    height={335}
/>

Name it however you like, for example `[NoDelete] My BodySlide Output`.

<DocImage
    src={require('./img/bodyslide_guide/2_create_mod.png').default}
    alt="Name the custom BodySlide output mod"
    style={{ maxHeight:200 }}
    width={205}
    height={146}
/>

:::tip
Adding `[NoDelete]` before the name keeps the mod when you update the list. After an update it will be disabled and moved to the bottom of the last separator - just move it back into place and enable it.
:::

**Drag it to the very bottom of the left pane, below `Licentia NEXT - BO 4 - HIMBO - Unassigned`**, and enable it. Being last means it wins over the list's output - so if your new mod replaces a vanilla outfit the list also builds, yours is what you'll see.

You only need one such mod - reuse it for every outfit mod you add later.

### Step :two: &mdash; Open BodySlide from MO2

In the top right of `MO2`, pick **`BodySlide`** from the executables dropdown and click `Run`.

<DocImage
    src={require('./img/bodyslide_guide/3_run_bodyslide.png').default}
    alt="Launching BodySlide from Mod Organizer 2"
    style={{ maxHeight:300 }}
    width={813}
    height={407}
/>

:::warning
If BodySlide shows missing textures or can't find files, check its **game data path** (`Settings` in BodySlide): it must point at your Licentia NEXT `Stock Game\Data` folder, **not** the Steam install. Right-click `Stock Game\Data` in Explorer, `Copy as path`, paste it there.
:::

### Step :three: &mdash; Pick only the new outfits

Use the **`Filter Outfits`** search box in the top right to find the slider sets from the mod you added (search for its name, or a word from the outfit names).

Then decide which body they are for - **build female and male separately**, never together:

- **Female** outfits are made for `CBBE 3BA` (names usually say `3BA`, `3BBB` or `CBBE`). If a mod offers both a `3BA` and a plain `CBBE` version, take the `3BA` one; if it offers physics and no-physics versions, take the **physics** one - that's what the rest of the list uses.
- **Male** outfits are made for `HIMBO` (names usually say `HIMBO`).
- An outfit made for a body we don't use (`UNP`, `BHUNP`, `CBBE SE` without 3BA, `SOS`/`SAM Light`, …) won't fit - get the `3BA` or `HIMBO` version of the mod instead.

### Step :four: &mdash; Choose the matching preset

From the preset dropdown at the top:

- Female: **`- Zeroed Sliders -`**
- Male: **`HIMBO Zero for OBody`**

<DocImage
    src={require('./img/bodyslide_guide/4b_preset_sample.png').default}
    alt="BodySlide preset dropdown"
    style={{ maxHeight:300 }}
    width={334}
    height={318}
/>

:::danger
**Always a zeroed preset.** OBody applies body shapes in game on top of the mesh. Build with any other preset and those outfits will look inflated or mismatched against everything else.
:::

### Step :five: &mdash; Batch Build into your own mod

At the bottom left, tick **`Build Morphs`** (required - OBody needs the morph files) and the checkbox next to the preview.

<DocImage
    src={require('./img/bodyslide_guide/5_batch_build.png').default}
    alt="BodySlide Batch Build button and Build Morphs option"
    style={{ maxHeight:100 }}
    width={591}
    height={87}
/>

1. Hold **`Left CTRL`** and click **`Batch Build`** - holding Ctrl is what lets you choose where the files go.
2. Check the list of outfits that pops up - only the ones you meant to build should be ticked - and click **`Build`**.
3. A folder picker opens. Go to your Licentia NEXT folder, then `mods`, and select **your own output mod** from Step :one:.
4. If BodySlide asks you to choose between variants that write the same file, pick the one that matches Step :three: (3BA over CBBE, physics over no physics).

If the new mod has both female and male outfits, now repeat Steps :three: to :five: for the other body with its own preset, into **the same** output mod.

### Step :six: &mdash; Refresh MO2 and check in game

Close BodySlide, hit `F5` in MO2, and make sure your output mod is enabled and still at the very bottom. Done! :crown:

:::note
You **don't** need to re-run the list's BSBB build after adding an outfit - your mod is separate and survives every BSBB rebuild. The only time to re-run BSBB is when you want the list's own output refreshed (Part 1).
:::

<details>
<summary>:information_source: Troubleshooting</summary>

- **The outfit is invisible in game.**
    It wasn't built, or it was built to the wrong place. Check that your output mod contains the mesh (right-click it in MO2 → `Open in Explorer`) and that it's enabled and at the bottom.

- **The outfit looks shrunk, inflated, or clips through the body.**
    Wrong preset (not zeroed), `Build Morphs` wasn't ticked, or you built a female outfit for a male body (or the other way round). Rebuild it with the right preset and Build Morphs on.

- **The outfit is invisible in first person only.**
    Some conversions have a mesh transform problem that only shows with Improved Camera. It's a mesh issue in the outfit mod, not your build - report it to that mod's author.

- **BSBB (Part 1) now reports a conflict or ignored outfits.**
    A mod you added shares a mesh or a slider-set name with the list. Build your mod the Part 2 way and leave the list's config alone - or, if you know what you're doing, add a rule for it in `bsbb_config.xml`.
</details>

:::tip
If you have any further questions or problems, stop by the **Licentia Next** category in [Vermi's Hub Discord Server](https://discord.gg/vermishub) and we can help you work them out!
:::

---

## ♻️ Removing OBody from your installation

If you want to **remove OBody** and have one fixed body for everyone:

1. Disable OBody in MO2: under the `BODIES` separator (or search for `OBody`), untick `OBody Next Generation` and the ORefit masterlist, and under `Body Meshes (and physics)` the two `3BA with OBody Collision Physics Fix` patches.
2. Open **BSBB** (Part 1, Step :two:), **double-click each build** to edit it, and change its preset to the one you want (female builds 1 and 3, male builds 2 and 4).
3. Click **`Build All`**.

Outfits you built yourself in Part 2 need rebuilding with the same preset too.
