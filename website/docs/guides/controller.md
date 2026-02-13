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

That's it.  Go play the Game.


:::tip
:clock1: This process takes around 30 seconds. 
:::

Read through the entire guide for explanation of changes, mods used and finally, all the keybinds.

---

## Step :one: &mdash; Turn on Your controller
You are your own here

## Step :two: &mdash; Run the Controller Setup MCM

To do that go the the MCM and find MCM Recorder.

<img 
    src={require('./img/controller_guide/8_MCM_Setup1.png').default}
    alt="List of controller mods"
    style={{ width:'auto', maxHeight:200 }}
    className="zoomable"
/>

Click that then run Setup Controller 

<img 
    src={require('./img/controller_guide/9_MCM_Setup2.png').default}
    alt="List of controller mods"
    style={{ width:'auto', maxHeight:200 }}
    className="zoomable"
/>

Follow the on screen instructions.  When it completes your are done.

:::note
**If you want to revert the changes**

Run the Revert Controller recording.  That will put everyting back to default.
:::

## Notable Changes

Wait has been removed from the controller.  That function is now available on the **tween** menu.  Scroll to the right and you will find it.

The individual menus Magik/Power, Leveling, Inventory and Map have been added.  Available through Wait + XYBA respectively

Sprinting can now be done with the Left Stick (LS).  By pushing the stick forward, you can walk, run and now sprint.  When you first want to sprint push LS completely forward and tap RB.  You don't need to hold it.  

This behaviour stays in place until it is interrupted by dodging or some other disrupting action.  To re-establish, tap RB.

## Mods Involved in Controller Setup 

<img 
    src={require('./img/controller_guide/10_Controller_Mods.png').default}
    alt="Controller enabled in settings"
    style={{ width:'auto', maxHeight:300 }}
    className="zoomable"
/>


- **Licentia NEXT - Control Map** changes **keyboard** setup of `TUCS` to be compatible with the default Licentia NEXT's keyboard controls and adds individual menu selection.

- **Auto Input Switch** allows you to freely move between keyboard and the controller. Handy in many cases especially using `OStim` controls.

- **Serio's Cycle Hotkeys** allows players to map hotkeys or use the vanilla hotkeys to equip weapons, shields, shouts, and spells in the right hand, left hand, and shout/power slots. It enables **8** Hotkeys on the controller. Explained at [TUCS modpage](https://www.nexusmods.com/skyrimspecialedition/mods/29381).

- **Special Sprinting Revamped** Provides sprint capability on Left Stick. For any questions see the [modpage](https://www.nexusmods.com/skyrimspecialedition/mods/151533).

## Reference - MCM Changes and Control Verification

Verify that **Sneak** is set to `B` *(it should be, but just in case)*. This is necessary for `The Ultimate Dodge Mod`.

<img 
    src={require('./img/controller_guide/3_set_controls.png').default}
    alt="Sneak is set to B"
    style={{ width:'auto', maxHeight:300 }}
    className="zoomable"
/>

**CGO**
<img 
    src={require('./img/controller_guide/4_setup_CGO.png').default}
    alt="CGO settings"
    style={{ width:'auto', maxHeight:300 }}
    className="zoomable"
/>

- **Switch Grip** - `DPad UP`
- **Dual Wield Blocking** - `DPad Down`

**The Ultimate Dodge Mod**
<img 
    src={require('./img/controller_guide/5_setup_The_Ultimate_Dodge_Mod.png').default}
    alt="TUDM settings"
    style={{ width:'auto', maxHeight:300 }}
    className="zoomable"
/>

- Your **Dodge Key** will now be `B`
- **Sneak** is `DPad Left`

**Serios Hotkeys**
<img 
    src={require('./img/controller_guide/6_setup_Serios_Cycle_Hotkeys.png').default}
    alt="SCH settings"
    style={{ width:'auto', maxHeight:200 }}
    className="zoomable"
/>

- Press `Home` when you are in game and have weapons equipped - **the mod's dialog will pop up, where you can set your keys**. Refer to the [mod page](https://www.nexusmods.com/skyrimspecialedition/mods/27184) for detailed instructions!

:::note
A note about **Target Lock** - that setting is located inside `True Directional Movement` MCM, and should be already configured - **just verify it looks like the screenshot:**

<img 
    src={require('./img/controller_guide/7_setup_True_Directional_Movement.png').default}
    alt="TDM settings"
    style={{ width:'auto', maxHeight:300 }}
    className="zoomable"
/>
:::

---

## :pushpin: Final configuration

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
|**RB** | Sprint |
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
|**Wait+X**| Magik/Powers Menu
|**Wait+Y**| Leveling
|**Wait+B**| Inventory
|**Wait+A**| Map

---

**That's all Folks!**
Go kill a dragon! :dragon:




