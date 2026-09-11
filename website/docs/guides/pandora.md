---
sidebar_position: 3
title: "Pandora Guide 🦋"
hide_title: true
slug: /guides/pandora
description: "How to re-run Pandora Behaviour Engine for Licentia NEXT Skyrim modlist"
image: ./img/pandora-guide-social.png
---

# <span className="licentia-heading licentia-heading--h1">Pandora Guide</span>
---

# 🦋 How to re-run Pandora for Licentia NEXT

:::note
**WHY YOU MIGHT NEED THIS?**

You added/updated NSFW, regular or combat animations that don't work with `DAR` or `OAR`; if you don't rerun the behaviour engine - your characters will _T-Pose_.

You want to rerun the behaviour engine for any other reason.
:::

:::warning
**Licentia NEXT `13.7.0` replaced Nemesis with Pandora.** If you are on `13.6.x` or older, use the [Nemesis Guide](/guides/nemesis) instead - these are **not** interchangeable, and you should never run both into the same output.
:::

These are the general steps to **re-running Pandora** for **Licentia NEXT**:
1. Launch `Pandora Behaviour Engine Plus` from MO2
2. Check Pandora's settings point at the right folders
3. Tick the behaviour patches and set their order
4. Click `Launch Engine`
5. **Verify the output** _(new - please don't skip this)_
6. Refresh MO2, done!

:::tip
:clock1: This process takes around 3 minutes - considerably faster than Nemesis.
:::

---

## ☝️ What changed from the Nemesis guide

If you have re-run Nemesis before, three things are now different, and all three are simpler:

- **No Large Address Aware patch.** Pandora is 64-bit .NET. That whole first step is gone.
- **No cache clearing ritual.** Pandora tracks its own output in `Pandora_Engine/PreviousOutput.txt` and deletes stale files automatically on each run.
- **The output folder is a setting, not a side effect.** Nemesis wrote generated behaviours into whichever mod happened to own the file path, scattering output across `TUDM`, `AGO` and `CGO`. Pandora writes wherever `Settings.json` tells it to. Nothing lands in `overwrite`, and nothing lands in another mod's folder.

---

## Step :one: &mdash; Launch `Pandora Behaviour Engine Plus` from MO2

:::tip
Ensure that **all antivirus and antimalware applications are temporarily disabled**. They can interfere with behaviour generation.
:::

In `MO2`, in the top right corner of the window, click on the dropdown menu and select `Pandora Behaviour Engine Plus`, then click `Run`:

<DocImage
    src={require('./img/pandora_guide/1_1_run_pandora_from_mo2.png').default}
    alt="Launch Pandora Behaviour Engine Plus from the MO2 executable dropdown"
    style={{ maxHeight:150 }}
    width={1285}
    height={249}
/>

:::note
Pandora **must** be launched through MO2. Launched on its own it cannot see the virtual `Data` folder and will generate a behaviour set built from almost nothing. The `Engine.log` line `Detected launcher: ModOrganizer` confirms it started correctly.
:::

---

## Step :two: &mdash; Check Pandora's settings

Now you need to verify Pandora's settings are correct. Click the `Gear` icon on the bottom left, and make sure that `Skyrim Data` is set to `C:\YOUR_LICENTIA_INSTALL_PATH\Stock Game\Data` and `Output Folder` is set to `C:\YOUR_LICENTIA_INSTALL_PATH\mods\Licentia NEXT - Pandora Output`.

<DocImage
    src={require('./img/pandora_guide/2_1_settings.png').default}
    alt="Pandora settings showing the Skyrim Data and Output Folder paths"
    style={{ maxHeight:250 }}
    width={1128}
    height={864}
/>

:::tip
You can keep using `Licentia NEXT - Pandora Output` as an output, but this would **overwrite** Licentia's default behaviours, so you can make your own mod that loads AFTER and set it as `Output Folder` in these settings.
:::

<details>
<summary>🔩 How Licentia ships its Pandora's settings (for the curious)</summary>

Pandora keeps its configuration - the game data folder it reads, and the output folder it writes - in a single file that ships with the list:

```
\mods\Licentia NEXT - SKSE Settings & Various Configs\Settings.json
```

It looks like this

```json
{
  "app": {
    "theme": 0
  },
  "games": {
    "SkyrimSE": {
      "gameDataPath": "C:\\YOUR_LICENTIA_INSTALL_PATH\\Stock Game\\Data",
      "outputPath": "C:\\YOUR_LICENTIA_INSTALL_PATH\\mods\\Licentia NEXT - Pandora Output"
    }
  }
}
```

</details>

---

## Step :three: &mdash; Tick the behaviour patches and set their order

When the Pandora window opens you will see the patch list. Tick the following:

- Archery Gameplay Overhaul SE
- AGO Sneak Bow Fix for Pandora
- TUDM Bow Aim Fix for Pandora
- Precision
- Precision Creatures
- Precision - Attack Collision Fixes
- Combat Gameplay Overhaul SE
- Dual Wield Behavior Fixes
- Extra Drawing Animations
- Horsepower - Modernized Horse Riding
- Skyrim's Paraglider
- True Directional Movement - 360 Horse Archery
- No turn animations *(from `Disabled Turn Animations`)*
- Animation Teleport Bug Fix
- The Ultimate Dodge Mod
- TUDM Attack Cancel
- USSEP Behaviour Patch
- Unarmed Sprint & Sneak Roll Fix
- Every OStim animation pack you have installed *(they are all additive - tick them all)*

:::note
`True Directional Movement - Headtracking` and `- Procedural Leaning` are deliberately **left unticked**. Licentia NEXT does not use those TDM features, and they were not patched under Nemesis either.
:::

<DocImage
    src={require('./img/pandora_guide/3_1_select_patches.png').default}
    alt="Pandora patch list with the Licentia NEXT patches ticked"
    style={{ maxHeight:400 }}
    width={2049}
    height={1276}
/>

:::tip
Use the **grippers** on the left of each row to drag-and-drop priority.
:::

:::warning
**Order only matters for patches that edit the same behaviour nodes.** Pandora's own rule is that priority increases as you go **down** the list, and higher priority overwrites - so of two patches touching the same node, the **lower** one normally wins.

There is one documented-behaviour exception, found while building the two bow fixes below: that rule holds for ordinary `<hkparam>` values, but where two patches replace an **element inside an array**, the **earlier** patch wins instead. That is why the ordering below is not simply "fixes last".

**The four pairs that actually matter in Licentia NEXT:**

| Must come first | Then | Why |
|---|---|---|
| `Archery Gameplay Overhaul SE` | `AGO Sneak Bow Fix for Pandora` | The fix replaces AGO's sneak-bow blend layers, so it has to overwrite them |
| `TUDM Bow Aim Fix for Pandora` | `The Ultimate Dodge Mod` | Reversed on purpose - the contested node is an array element, so the **earlier** patch wins |
| `The Ultimate Dodge Mod` | `TUDM Attack Cancel` | Attack Cancel layers on top of TUDM; placed above it, ~50 of its edits are silently discarded |
| `Precision`, `Precision Creatures` | `Precision - Attack Collision Fixes` | The fix layer belongs below the mod it fixes |

`USSEP Behaviour Patch` sits near the bottom on purpose - it is a bug-fix patch and should win the handful of nodes it shares with anything else.

**Everything else can go anywhere.** All the OStim animation packs *(OStim, Billyy's, Anub's, Leito's, Nibbles', OARE, Drago's, Tweens', etc.)* only add clips and never contend with each other or with the combat patches, so wherever they land in the list is fine - add new ones without worrying about position.
:::

:::note
`Ultimate Combat / TK Dodge` is **not** part of Licentia NEXT. It only appeared in the old Nemesis guide because `Third Person bows aiming misalignment bug fix for TK dodge or TUDM` required it, and that mod is no longer used.
:::

Your ticked set is saved to `Licentia NEXT - Pandora Output\Pandora_Engine\ActiveMods.json`, so it persists between runs. If you ever want to check what actually ran without opening the GUI, read that file.

---

## Step :four: &mdash; Click `Launch Engine`

After you've selected all the patches, just click `Launch Engine` at the bottom right.

<DocImage
    src={require('./img/pandora_guide/4_1_launch_engine.png').default}
    alt="Click Launch Engine in the Pandora window"
    style={{ maxHeight:250 }}
    width={2049}
    height={1276}
/>

Generation takes roughly **1 minute** on a modern machine. The window flashes in the taskbar when it finishes.

:::note
Pandora is **error-tolerant by design**. Lines like this in the log are normal and mean the engine caught a conflicting edit and skipped it rather than producing a broken behaviour file:

```
WARN : Validator > defaultfemale~1hm_behavior > Duplicate Event > Collision_Remove > Index > 488 > SKIPPED
```

A run with dozens of `Duplicate Event ... SKIPPED` warnings is still a good run. What you care about is `ERROR`.
:::

The full log is written to `Licentia NEXT - Pandora Output\Engine.log`.

---

## Step :five: &mdash; Verify the output

:::danger
**Please do not skip this step.** A behaviour engine can finish with zero errors and still produce a behaviour graph the game cannot load - the result is a crash on save load, roughly 100 seconds after launch, pointing at `0_Master.hkx` with no useful message. Checking takes a few seconds. Finding it the hard way takes a day.
:::

**1. Check the engine actually wrote to the right place.** `Licentia NEXT - Pandora Output` should contain a fresh `meshes\actors\...` tree and an `Engine.log` with the current timestamp. Nothing should have appeared in `overwrite`, and nothing new should be inside `TUDM`, `Archery Gameplay Overhaul` or `Combat Gameplay Overhaul SE`.

**2. Check `Engine.log` for real errors.** `WARN ... SKIPPED` lines are fine. `ERROR` lines are not. Open `Engine.log` in Notepad and search it with `Ctrl + F` for `ERROR` - or from a terminal:

```powershell
Select-String -Path "<your Licentia install path>\mods\Licentia NEXT - Pandora Output\Engine.log" -Pattern "ERROR"
```

**3. Keep a snapshot of every good run.** Before changing anything, archive the output and the mod state together, so you always have a build you can return to.

---

## Step :six: &mdash; Refresh MO2, done!

Hit `F5` in MO2 to refresh. If you see `FNIS.esp` that has appeared on the right pane in `Plugins` section - you can untick it or delete it, Licentia doesn't need `FNIS.esp` *(but Pandora still may generate it sometimes)*

**That's it, you're done!** :crown:

---

<details>
<summary>:information_source: Troubleshooting</summary>

- **Pandora finishes suspiciously fast, or the patch list is nearly empty.**
  It was not launched through MO2 and cannot see the virtual `Data` folder. Check `Engine.log` for `Detected launcher: ModOrganizer`.

- **Characters T-Pose after a successful run.**
  `Output Folder` in Pandora's settings is pointing somewhere that is not the `Licentia NEXT - Pandora Output` mod *(or your custom output mod)*, or that mod is disabled in MO2. Check both.

- **A patch you expect is missing from the list entirely.**
   Pandora only shows patches whose mod is enabled in MO2 and that carry an `info.ini`. A patch supplied by a mod you disabled will disappear without warning.

- **Disabling a mod does not remove its patch from an existing build.**
  The Pandora generated `.hkx` files still contain everything from the last run. To actually drop a patch, untick it in Pandora and **re-run the engine** - toggling the mod in MO2 alone changes nothing.

- **The run errors out.**
  Read `Engine.log` from the top. Unlike Nemesis, Pandora names the exact project and node it had trouble with. `WARN ... SKIPPED` lines are normal; look for `ERROR`.

- **You want to go back to Nemesis.**
  Nemesis is no longer part of Licentia NEXT - both the engine and its output mod were removed in `13.7.0`. You would need to install `Project New Reign - Nemesis Unlimited Behavior Engine` yourself + all needed Nemesis patches for Licentia, disable `Licentia NEXT - Pandora Output` and `Pandora Behaviour Engine Plus`, and generate a fresh output. Never leave two behaviour output mods enabled at once. Please refer to the old [Nemesis Guide](/guides/nemesis) if you need to.
</details>
