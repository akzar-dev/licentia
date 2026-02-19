---
sidebar_position: 2
title: "Technical FAQ 🛠️"
hide_title: true
slug: "/faqs/technical"
description: "Technical FAQ for Licentia NEXT Skyrim modlist"
image: ./img/faq-technical-social.png
---

# ![Technical FAQ](./img/faq-technical-heading.png)

---

:::tip
If you don't find the answer here - visit our Discord server for further assistance:
[Vermi's Hub](https://discord.gg/vermishub)
:::

### I crashed!
<details>
<summary>Expand</summary>

Slow down there pardner. Skyrim crashes **all the time**, less so in vanilla but more so with over 1000 mods.

So, your steps are: 
- First make sure it crashes the next time you do the exact same thing *(completely random crashes are not a bug, they are a feature of Skyrim)*.
- If it does, drop by the support channels on [Discord](https://discord.gg/vermishub) and give as much details as possible + attach your saves *(both files!)* and a crashlog *(they are  located in `Documents\My Games\Skyrim Special Edition\SKSE`)*, we'd take a look!
</details>

### I'm randomly crashing!
<details>
<summary>Expand</summary>

You probably don't have enough paged RAM. Skyrim is very badly optimized. Try increasing your pagefile size. Refer to the primary [Pre-Installation](/pre-installation#general-pc-adjustments) document for details.

Alternatively, you don't have enough VRAM *(if your GPU has less than 8 GB of memory)* - you'd have to run [VRAMr](https://www.nexusmods.com/skyrimspecialedition/mods/90557).
</details>

### I gave something to a follower and it crashed!
<details>
<summary>Expand</summary>

Was it less than a full stack of arrows but more than half of that stack of arrows? Yeah, this is a bug and can't be fixed. Don't do that!

If it was something else, first launch the game and try it again. If it happens again report it to our [Discord](https://discord.gg/vermishub) and tell us which item it was! Preferably with the ID (or screenshot of opened console where you clicked the offending item, it's IDs should be in bottom right)
</details>

### I can't get out of a crafting animation! OR My followers or other characters got stuck somewhere!
<details>
<summary>Expand</summary>

Bugs such as this are common to many lists, and `moveto player` consile command is the go-to solution. 

- If you get stuck in a crafting or other SFW animation, open the console with the **tilde** key (to the left of the number 1 along the top of your keyboard) and type `player.moveto player`. That will get you out of it. I find that getting stuck in animations is common if you are attempting to craft or do some repetitive animation in first person. The list should switch you to third automatically **but you could try doing so yourself** before mining ores, brewing potions, etc.

- If an NPC gets stuck on some landscape or architecture, you can use a similar command. For followers imported into NFF, you can strike the `F6` key to teleport them all to you at once _(especially useful if you are sprinting in the Overworld)_ Keep in mind that "SUPER" followers such as **Inigo** and **Lucien** **CANNOT** be imported into NFF. If other NPCs get stuck, open console just as above, and click on them until they are highlighted in white _(you may need to scroll your mouse wheel until this occurs)_. Then type `moveto player` and they will appear close to you and should be able to continue.
</details>

### I have problems with the camera! Flickering, weird 1st person body clipping! Can't switch to 3rd person!
<details>
<summary>Expand</summary>

These are all caused by the extremely janky customization that makes first person POV intercourse under OStim a possibility. 

You are probably better off disabling these mods in the left pane of MO2:
- `Improved Camera SE`
- `Improved Camera - Sacrosanct patch`
- `OStim Improved Camera Configuration`

They do not have traditional ESPs, so your save will be fine, BUT you will lose the ability to see your character's body in first person!

For a compromise, you can switch _to_ third person with the `F` key, and _back_ to first person with the scroll wheel.
</details>

### My performance is really terrible, low FPS, input lag during combat!
<details>
<summary>Expand</summary>

Refer to the primary installation guide and ensure you meet all the [system specification requirements](/system-requirements)!

You can try:
- [VRAMr](https://www.nexusmods.com/skyrimspecialedition/mods/90557)
- some Frame Generation mods and tools (like [Lossless Scaling](https://store.steampowered.com/app/993090/Lossless_Scaling/))
- switching to Community Shaders (not easy and not supported by us, but can be done)
</details>

### I can't start an OStim scene or receive errors when attempting to do so!
<details>
<summary>Expand</summary>

The first thing you can try is navigating to the _OStim_ MCM and selecting the `Update All` option near the bottom left. Close all menus and wait about 60 seconds, then attempt your adult interaction again.

If this doesn't work, perhaps one of the _OStim_ plugins did not install properly via _Wabbajack._ Try right-clicking on the _OStim Standalone_ mod in _Mod Organizer 2_ and selecting `Reinstall`. There shouldn't be any options to choose, so just click through. Launch the game and attempt your adult interaction again.

If this *STILL* doesn't work, refer to the [Installation guide](/installation#download-and-install-the-list) and keep reinstalling the list until the error messages go away.
</details>

### I can no longer end an OStim scene!
<details>
<summary>Expand</summary>

Ensure that you **do not have** `Freecam At Start` enabled in _OStim_ MCM. Sometimes this stops functioning properly on long playthroughs.
</details>

### I have a bug that's not in this list.
<details>
<summary>Expand</summary>

First of all, do the research by yourself first. Read the mod pages, check the comments, search the internet. 

If you still can't find a solution, then drop by our [Discord](https://discord.gg/vermishub) and ask for help in the modded support channels, but **don't expect that someone will fix it for you**.
</details>

### I added a mod (or mods) and something weird happened.
<details>
<summary>Expand</summary>

Feel free to stop by our server and **talk about it in the modded support channel**. 

We're usually willing to help unless you did something crazy like add seven huge quest mods, all available patches for those mods, and all available LOTD patches for those mods and their patches. Then you're on your own! 

You can always browse _[Lively's Learn To Mod Series](https://github.com/LivelyDismay/Learn-To-Mod)_ to get info on how to change any modlist you want properly. Good luck!
</details>

### There's more than 255 ESPs! Will this thing even launch?
<details>
<summary>Expand</summary>

Yes!`ESP`s flagged as `ESL` don't count. 

If you're curious - hover over the little number of active plugins in top right in MO2 to see how many real ESPs there are.
</details>

### My load order got messed up!
<details>
<summary>Expand</summary>

You should always keep a backup of your load order and install order, especially before you start adding or removing mods.

I have included default backups for both mods and plugins just in case you need them:
- Click the swirly arrows icon in MO2
- There's one for the load order (right pane) and one for the install order (left pane)
- Be sure to get the most recent ones if there's multiple (usually only one)!
</details>

### I crash in Project AHO when I complete a certain quest!
<details>
<summary>Expand</summary>

Try this:
- Load before you start the quest's conclusion
- Complete a step
- Save
- Reload
- Complete the next step
- Continue until you finish the quest without crashing. 

I have a confirmation that this does work.
</details>

### My quests have started to disappear from my Quest Log.
<details>
<summary>Expand</summary>

Skyrim uses a very tiny variable to keep track of these. The maximum number of quests you can have, both active **AND COMPLETED,** cannot exceed 255:

- When this happens, the older quests will start to vanish. _There is no way around this limitation, it is hard-coded into the game._ 

- If you somehow find yourself playing the hundreds of hours required to do this many quests, read and follow the directions in [this mod](https://www.nexusmods.com/skyrimspecialedition/mods/56130) when you first notice the problem

- You can also find a Synthesis / Mutagen version of this *Quest Recovery tool* if you are more advanced.

- There is also a Quest Recover MCM you can run to get the missing quests back.
</details>
