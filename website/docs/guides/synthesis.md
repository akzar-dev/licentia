---
sidebar_position: 4
title: "Synthesis Guide ♻️"
hide_title: true
slug: /guides/synthesis
description: "How to re-run Synthesis for Licentia NEXT Skyrim modlist"
image: ./img/synthesis-guide-social.png
---

# <span className="licentia-heading licentia-heading--h1">Synthesis Guide</span>
---

# ♻️ How to re-run Synthesis for Licentia NEXT

:::note
**WHY YOU MIGHT NEED THIS?**

You added/updated various mods that are affected by Synthesis (new locations, armors, food, etc).

You want to rerun Synthesis for any other reason.
:::

These are the general steps to **re-running Synthesis** for **Licentia NEXT**:
0. *(first run, or after a Synthesis update)* `.NET 10` SDK, the `Data Folder` setting, and when to run outside MO2
1. Disable old `Synthesis` outputs
2. Launch `Synthesis` from MO2
3. Check the patches list
4. Run `Synthesis` 3 times
5. Move your new generated Synthesis outputs to a separate mod
6. Enable plugins disabled in Step :one:

:::tip
:clock1: This process takes around 5 minutes. Let's dive into the details!
:::

---

## Step :zero: &mdash; First run, or after updating Synthesis

Skip this if you have run Synthesis before and have not updated it since. Otherwise read it once - two of these will silently waste your time if they are wrong.

### 🟡 `.NET 10` SDK

Synthesis now needs the **[.NET 10 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/10.0)**.

:::warning
Earlier versions of this guide told you to install `.NET 8` and to **remove** `.NET 9` and `.NET 10`. That is out of date - the [bug](https://github.com/Mutagen-Modding/Synthesis/issues/557) behind it is fixed. Install the `.NET 10` SDK (not just the Runtime - patchers are compiled on your machine, which needs the SDK). Leaving `.NET 8/9` installed alongside is fine.
:::

Check what you have with `dotnet --list-sdks` in a terminal. You want a `10.0.x` line.

### 🟡 Updating Synthesis itself

Synthesis does not update itself. Per the [official instructions](https://mutagen-modding.github.io/Synthesis/Updating-UI/), keep it reasonably current:

1. Download the latest release from [the GitHub releases page](https://github.com/Mutagen-Modding/Synthesis/releases).
2. **Back up these first** - they hold your entire patcher setup:
    - `PipelineSettings.json`
    - `GuiSettings.json`
    - the `Data\` folder
3. Unzip over your existing install, or unzip somewhere new and copy those three back in.

In Licentia NEXT, Synthesis lives at `<your modlist folder>\tools\Synthesis`.

:::tip
If an update ever leaves the patcher list empty, you overwrote `PipelineSettings.json`. Restore it from your backup - nothing else needs to be redone.
:::

### 🟡 Check `Data Folder` setting in Synthesis

You NEED to make sure that this setting is set up correctly *(usually it is, but check anyway after launching Synthesis for the first time in [Step 2](#step-two--launch-synthesis-from-mo2))*.

Click the `Gear` icon on the top right of Synthesis window **(1)**, and then make sure that `Data folder` field is correctly populated (should be `<your_licentia_install_path>\Stock Game\Data`):

<DocImage 
    src={require('./img/synthesis_guide/0_1_data_folder_setting.png').default}
    alt="Synthesis Data folder field setting"
    style={{ maxHeight:100 }}
    width={2269}
    height={931}
/>

### 🟡 MO2 mode &mdash; when to run Synthesis outside MO2

Recent Synthesis versions **refuse to build patchers while running inside MO2** (`BlockBuildingWithinMo2` in `PipelineSettings.json`). Building means compiling a patcher's source, which needs the SDK and does not work reliably through MO2's virtual filesystem.

That splits your workflow in two:

| What you're doing | How to launch |
|---|---|
| **Adding a patcher**, updating one, or changing patcher versions | Run **`tools\Synthesis\Synthesis.exe` directly**, by double-clicking it - **not** through MO2 |
| **Running the patchers** to generate `Synthesis0/1/2.esp` | Run it **through MO2**, as in Step :two: below |

So: add or update patchers outside MO2, let them finish building, close Synthesis, then relaunch it from MO2 to actually produce the patches.

:::note
Both launch methods share the same `PipelineSettings.json`, so patchers you add outside MO2 are there when you come back in. The `Data Folder` setting above is what lets the direct launch still see the right game.
:::

---

## Step :one: &mdash; Disable old `Synthesis` outputs

1. Open your `MO2`, in left pane find mod called `Licentia NEXT - Synthesis Output` and disable it:
    <DocImage 
        src={require('./img/synthesis_guide/1_1_disabling_synthesis_output_mo2.png').default}
        alt="Disabling Licentia NEXT Synthesis output in Mod Organizer 2 (MO2)"
        style={{ maxHeight:100 }}
        width={1394}
        height={410}
    />

2. In right section with plugins, scroll to the bottom and disable these plugins (we will enable them again later):
    <DocImage 
        src={require('./img/synthesis_guide/1_2_disabling_plugins_mo2.png').default}
        alt="Disabling Synthesis plugins in Mod Organizer 2 (MO2)"
        style={{ maxHeight:100 }}
        width={1363}
        height={337}
    />

---

## Step :two: &mdash; Launch `Synthesis` from MO2

:::tip
Ensure that **all antivirus and antimalware applications are temporarily disabled**. They can prevent _Synthesis_ from running correctly.
:::


:::warning
You need the **`.NET 10` SDK** installed, and Synthesis's **`Data Folder`** pointed at your `Stock Game\Data`. Both are covered in [step :zero:](#step-zero--first-run-or-after-updating-synthesis) above - check them before your first run.

This is also the launch method for **running** patchers. If you are **adding or updating** a patcher, run `Synthesis.exe` directly instead - see [MO2 mode](#mo2-mode--when-to-run-synthesis-outside-mo2).
:::

In `MO2`, in top right corner of the window, click on the dropdown menu and select `Synthesis`, then click `Run`:
    <DocImage 
        src={require('./img/synthesis_guide/2_running_synthesis_in_mo2.png').default}
        alt="Opening Synthesis from Mod Organizer 2 (MO2)"
        style={{ maxHeight:100 }}
        width={1424}
        height={312}
    />

---

## Step :three: &mdash; Check the patches list

When `Synthesis` is launched, check out the left pane with patches. They should match this:

    - `Synthesis0` block:
        <DocImage 
            src={require('./img/synthesis_guide/3_1_synthesis0.png').default}
            alt="Synthesis 0 patch list"
            style={{ maxHeight:150 }}
            width={723}
            height={648}
        />

    - `Synthesis1` block:
        <DocImage 
            src={require('./img/synthesis_guide/3_2_synthesis1.png').default}
            alt="Synthesis 1 patch list"
            style={{ maxHeight:150 }}
            width={741}
            height={665}
        />

    - `Synthesis2` block:
        <DocImage 
            src={require('./img/synthesis_guide/3_3_synthesis2.png').default}
            alt="Synthesis 2 patch list"
            style={{ maxHeight:170 }}
            width={723}
            height={741}
        />

        :::note
        If you re-run `Synthesis2`, TUDM patch breaks 2 records. In xEdit, find `CACO'S BODY` mod and forward its changes to Synthesis2.esp (it would be `NakedTorsoHighElf` and `NakedTorsoWoodElf`)
        :::
---

## Step :four: &mdash; Run `Synthesis` 3 times

Now, you have to do this:

1. Click `Run` arrow under `Synthesis0` in the left pane;
2. When if finishes, **CLOSE SYNTHESIS**!
3. You will see that `Synthesis0.esp` appeared in the right pane of MO2, enable it;
4. Run `Synthesis` again in MO2;
5. Repeat **steps 1-4** for `Synthesis1`;
6. Repeat **steps 1-3** for `Synthesis2`.

:::warning
**DON'T RUN ALL 3 SYNTHESIS PATCHES IN A ROW (OR ALL AT ONCE)! ALWAYS CLOSE SYNTHESIS AFTER EACH RUN!**

Failing to do that will break consistency of the patches!
:::

---

## Step :five: &mdash; Move your new generated Synthesis outputs to a separate mod

1. In `MO2`, scroll to the bottom in the left pane, and right click on the `ADDED MODS - Make your additions below this line` separator. In the submenu, click `All Mods`, then select `Create Empty Mod Inside`.
    <DocImage 
        src={require('./img/synthesis_guide/5_1_creating_empty_mod_in_mo2.png').default}
        alt="Create Empty Mod"
        style={{ maxHeight:100 }}
        width={2232}
        height={341}
    />

    You will now be prompted to name your custom mod, this can be named however you want.

    :::tip
    Adding `[NoDelete]` before the name will make the mod not be removed upon updating the list.

    Upon updating the mod will be deactivated and moved to the bottom of the last separator, and you can simply move it into place and enable it.
    :::

    Now, right click on the newly created mod and select `Open in Explorer`. This will open the mod folder in your file explorer, **keep it open**.

2. In the bottom of `MO2` left pane right-click on `Overwrite` and select `Open in Explorer`. This will open the `Overwrite` folder in your file explorer. **Keep it open**.
    <DocImage 
        src={require('./img/synthesis_guide/5_2_overwrite.png').default}
        alt="Overwrite folder"
        style={{ maxHeight:120 }}
        width={1328}
        height={481}
    />

3. Move all 3 `Synthesis` .esp's from Overwrite to your newly created mod in file explorer.

4. Close both file explorers and go back to `MO2`. Hit `F5` to refresh it.

5. Make sure all 3 `Sythesis` outputs are enabled in the plugins list on the right.

---

## Step :six: &mdash; Enable plugins disabled in Step :one:

In right part of `MO2` just enable the plugins you disabled in Step :one:'s [second part](#step-one--disable-old-synthesis-outputs), and you're done!

The final picture should look like this *(only the names of plugins matter here, not numbers)*:
    <DocImage 
        src={require('./img/synthesis_guide/6_final.png').default}
        alt="Final Mod Organizer 2 (MO2) setup after Synthesis output installation"
        style={{ maxHeight:150 }}
        width={1405}
        height={609}
    />
