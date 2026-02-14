---
sidebar_position: 1
title: "Controller Guide 🎮"
hide_title: true
slug: /controller-guide
description: "How to set up a controller for Licentia NEXT Skyrim modlist"
image: ./img/controller-guide-social.png
---

# ![Controller Guide](./img/controller-guide.png)

---

# :video_game: How to set up a controller for Licentia NEXT

:::note
**WHY YOU MIGHT NEED THIS?**

You want to use a controller with Licentia NEXT. This guide will help you set it up properly.
:::

These are the general steps to set up a **controller** for **Licentia NEXT**:
1. Turn on **Your Controller**
2. Run **Setup Controller** in the MCM

:::tip
:clock1: This process takes around 30 seconds. 
:::

Read through the entire guide for explanation of changes, mods used and finally, all the keybinds.

---

## Step :one: &mdash; Turn on Your controller

You are on [your own](https://letmegoogleitforyou.com?q=how%20to%20turn%20on%20my%20controller) here 🎮

---

## Step :two: &mdash; Run the Controller Setup MCM

1. Press `Esc` to **open** the menu, find `Mod Configuration` and **click** it:
    <img 
        src={require('./img/controller_guide/1_1_mod_configuration.png').default}
        alt="Finding Mod Configuration in the menu"
        style={{ width:'auto', maxHeight:200 }}
        className="zoomable"
    />

2. **Scroll** down until you find `MCM Recorder` and **click** it *(the list is in alphabetical order, so it should be around the middle)*:
    <img 
        src={require('./img/controller_guide/8_MCM_Setup1.png').default}
        alt="MCM Recorder in the MCM"
        style={{ width:'auto', maxHeight:200 }}
        className="zoomable"
    />

3. Find `Setup Controller` on the right and **click** it:
    <img 
        src={require('./img/controller_guide/9_MCM_Setup2.png').default}
        alt="Setup Controller in MCM"
        style={{ width:'auto', maxHeight:200 }}
        className="zoomable"
    />

4. Follow the on screen instructions. When it completes - your are **done**!

:::tip
**If you want to revert controls back to Keyboard and Mouse setup ⌨️**

Run the `Revert Controller` recording inside the `MCM Recorder` menu the same way you've run `Setup Controller` above.

That will put everything back to default configuration!
:::

---

## ℹ️ Additional Information

### 📝 Notable Changes

- **Wait function** has been removed from the controller *(meaning it's not a separate button anymore)*. That function is now available on the **tween** menu. Scroll to the right and you will find it!

- The **individual menus** for `Magic/Power`, `Leveling`, `Inventory` and `Map` have been added. They're available through `Wait` + `XYBA` respectively.

- **Sprinting** can now be done with the `Left Stick (LS)`. By pushing the stick forward, you can walk, run and now sprint. When you first want to sprint - **push** `LS` completely forward and **tap** `RB`. You don't need to hold it anymore!

    This behavior stays in place until it is interrupted by dodging or some other disrupting action. To re-establish, tap `RB` again.

### 🛠️Mods Involved in Controller Setup

All of the needed mods are located inside this separator in `Mod Organizer 2`:
    <img 
        src={require('./img/controller_guide/10_Controller_Mods.png').default}
        alt="List of mods for controller setup"
        style={{ width:'auto', maxHeight:300 }}
        className="zoomable"
    />

- **Licentia NEXT - Control Map** changes **keyboard** setup of `TUCS` to be compatible with the default Licentia NEXT's keyboard controls and adds individual menu selection.

- **Auto Input Switch** allows you to freely move between keyboard and the controller. Handy in many cases especially using `OStim` controls.

- **Serio's Cycle Hotkeys** allows players to map hotkeys or use the vanilla hotkeys to equip weapons, shields, shouts, and spells in the right hand, left hand, and shout/power slots. It enables **8** Hotkeys on the controller. Explained at [TUCS modpage](https://www.nexusmods.com/skyrimspecialedition/mods/29381).

- **Special Sprinting Revamped** Provides sprint capability on Left Stick. For any questions see the [modpage](https://www.nexusmods.com/skyrimspecialedition/mods/151533).

### ☑️ Reference - MCM Changes and Control Verification
:::note
This is just a reference section to verify that your `MCM` settings look like this. If you followed the guide, they should be exactly the same. If not, you can change them manually to match these screenshots.
:::

1. Verify that **Sneak** is set to `B` *(it should be, but just in case)*. This is necessary for `The Ultimate Dodge Mod`:
    <img 
        src={require('./img/controller_guide/3_set_controls.png').default}
        alt="Sneak is set to B"
        style={{ width:'auto', maxHeight:300 }}
        className="zoomable"
    />

2. Verify **CGO** settings:
    <img 
        src={require('./img/controller_guide/4_setup_CGO.png').default}
        alt="CGO settings"
        style={{ width:'auto', maxHeight:300 }}
        className="zoomable"
    />

    - **Switch Grip** - `DPad UP`
    - **Dual Wield Blocking** - `DPad Down`

3. Verify **The Ultimate Dodge Mod** settings:
    <img 
        src={require('./img/controller_guide/5_setup_The_Ultimate_Dodge_Mod.png').default}
        alt="TUDM settings"
        style={{ width:'auto', maxHeight:300 }}
        className="zoomable"
    />

    - Your **Dodge Key** will now be `B`
    - **Sneak** is `DPad Left`

4. Verify **Serios Cycle Hotkeys** settings:
    <img 
        src={require('./img/controller_guide/6_setup_Serios_Cycle_Hotkeys.png').default}
        alt="SCH settings"
        style={{ width:'auto', maxHeight:200 }}
        className="zoomable"
    />

    - Press `Home` when you are in game and have weapons equipped - **the mod's dialog will pop up, where you can set your keys**. Refer to the [mod page](https://www.nexusmods.com/skyrimspecialedition/mods/27184) for detailed instructions!

5. Verify **True Directional Movement** settings:
    <img 
        src={require('./img/controller_guide/7_setup_True_Directional_Movement.png').default}
        alt="TDM settings"
        style={{ width:'auto', maxHeight:300 }}
        className="zoomable"
    />

    - **Target Lock with POV button (Gamepad)** is enabled
    - **Toggle POV Hold Duration** is set to `0.25` seconds

---

## :pushpin: Final configuration control map

Your control map now looks like this:
| Button | Action |
| :--- | :--- |
|**Start** | Journal |
|**Back** | Used as Modifier Key - Wait is on tween menu |
|**LT** | Left Attack |
|**RT** | Right attack |
|**LB+Back** | Quicksave |
|**RB+Start** | Tween menu (character menu) |
|**LB+RB** | Shout (in that order, you kinda have to roll your fingers across them) |
|**LB** | Looking for something to do |
|**Double-tap LB** | SKSE Menu |
|**RB** | Sprint (toggle) |
|**LS** | Favorites |
|**RS** | Target Lock/Long Press Switch POV |
|**A** | Activate |
|**B** | Roll/Dodge |
|**X** | Ready weapon |
|**Y** | Jump |
|**DPad Left** | Sneak / Stop Sneaking |
|**DPad Right**| Unused |
|**DPad Up** | Switch grip between 1-handed and 2-handed (CGO) |
|**DPad Down** | Dual Wield Blocking |
|**Wait+X**| Magic/Powers Menu
|**Wait+Y**| Leveling
|**Wait+B**| Inventory
|**Wait+A**| Map

---

**That's all Folks!**
Go kill a dragon! :dragon:
