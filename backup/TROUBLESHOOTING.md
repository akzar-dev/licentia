# :construction_worker: Troubleshooting

<p align="center">
  <a href="/README.md">Readme</a></b> |
  <b>[[<a href="/TROUBLESHOOTING.md">Troubleshooting</a>]]</b> |
  <a href="/guides/README.md">Guides</a> |
  <a href="/CHANGELOG.md">Changelog</a>
</p>

**Table of contents:**
- [:construction\_worker: Troubleshooting](#construction_worker-troubleshooting)
  - [Gameplay](#gameplay)
    - [I don't have one of those ancient NUMPADs! How am I gonna use OStim?](#i-dont-have-one-of-those-ancient-numpads-how-am-i-gonna-use-ostim)
    - [Leveling up is weird!](#leveling-up-is-weird)
    - [I can't level up my skills!](#i-cant-level-up-my-skills)
    - [How do I start the Main Story Quest? I went to Helgen but it is intact!](#how-do-i-start-the-main-story-quest-i-went-to-helgen-but-it-is-intact)
    - [Certain quests (especially the Creation Club quests) will not start or complete!](#certain-quests-especially-the-creation-club-quests-will-not-start-or-complete)
    - [I'm not receiving the extra Thane weapons from Balgruuf (or others, when I complete their quests).](#im-not-receiving-the-extra-thane-weapons-from-balgruuf-or-others-when-i-complete-their-quests)
    - [WARNING! DON'T LISTEN TO ORLANDO!](#warning-dont-listen-to-orlando)
    - [I love the paraglider mod, but I keep dying when I land!](#i-love-the-paraglider-mod-but-i-keep-dying-when-i-land)
    - [The tuning gloves in Winterhold seem to be acting up.](#the-tuning-gloves-in-winterhold-seem-to-be-acting-up)
    - [The Civil War questline is horribly messed up. I can't complete the Battle(s) of Whiterun / Solitude / Windhelm. People are inverting backwards off the ground. Enemies don't stop spawning. There's no Ulfric/Tullius!](#the-civil-war-questline-is-horribly-messed-up-i-cant-complete-the-battles-of-whiterun--solitude--windhelm-people-are-inverting-backwards-off-the-ground-enemies-dont-stop-spawning-theres-no-ulfrictullius)
    - [I can't complete the bandit raid quest for Whiterun (or another city)](#i-cant-complete-the-bandit-raid-quest-for-whiterun-or-another-city)
    - [I'm trying to kill the Necromancers for Undeath and the quest won't complete.](#im-trying-to-kill-the-necromancers-for-undeath-and-the-quest-wont-complete)
  - [Technical](#technical)
    - [I crashed!](#i-crashed)
    - [I'm randomly crashing!](#im-randomly-crashing)
    - [I gave something to a follower and it crashed!](#i-gave-something-to-a-follower-and-it-crashed)
    - [I can't get out of a crafting animation! OR My followers or other characters got stuck somewhere!](#i-cant-get-out-of-a-crafting-animation-or-my-followers-or-other-characters-got-stuck-somewhere)
    - [I have problems with the camera! Flickering, weird 1st person body clipping! Can't switch to 3rd person!](#i-have-problems-with-the-camera-flickering-weird-1st-person-body-clipping-cant-switch-to-3rd-person)
    - [My performance is really terrible, low FPS, input lag during combat!](#my-performance-is-really-terrible-low-fps-input-lag-during-combat)
    - [I can't start an OStim scene or receive errors when attempting to do so!](#i-cant-start-an-ostim-scene-or-receive-errors-when-attempting-to-do-so)
    - [I can no longer end an OStim scene!](#i-can-no-longer-end-an-ostim-scene)
    - [I have a bug that's not in this list.](#i-have-a-bug-thats-not-in-this-list)
    - [I added a mod (or mods) and something weird happened.](#i-added-a-mod-or-mods-and-something-weird-happened)
    - [There's more than 255 ESPs! Will this thing even launch?](#theres-more-than-255-esps-will-this-thing-even-launch)
    - [My load order got messed up!](#my-load-order-got-messed-up)
    - [I crash in Project AHO when I complete a certain quest!](#i-crash-in-project-aho-when-i-complete-a-certain-quest)
    - [My quests have started to disappear from my Quest Log.](#my-quests-have-started-to-disappear-from-my-quest-log)
  - [For More Information](#for-more-information)

## Gameplay

### I don't have one of those ancient NUMPADs! How am I gonna use OStim?
<details>
  <summary>Expand</summary>

The _OStim_ controls can be remapped in the `MCM` for that mod. It may be difficult to find enough free keys without a NUMPAD thoug.
</details>

### Leveling up is weird!
<details>
  <summary>Expand</summary>

The prompt to level up your skills will appear after you level up. 

**Not working?** The `Uncapper` preset prevents skills from leveling beyond your level +18, to a maximum of twice your level. If your skill won't go up any further, try gaining a level!

**Skill not leveling up upon reading a skill book?** Make sure you're not at the cap, then check for any debuffs to skill gain on your magic effects tab. Take care of those, then try again.
</details>

### I can't level up my skills!
<details>
  <summary>Expand</summary>

This is due to a _Static Skill Leveling_ conflict. If you have _any_ effect on your character that either reduces or increases Skill XP by any amount, the point distribution will seem to work, but nothing will actually increase in the Statistics menu. This will also prevent Skill Books from increasing Skills. Most commonly this is due to XP penalties from survival-related debuffs, so before leveling up, make certain you take care of all your physical needs. You might also want to verify that you apply your Skill Points only when all similar effects are inactive. If you have made certain of this and still can't get Skill Points, ensure that you are not at the Skill Cap for your race. The cap can be identified in the Statistics menu as a red or gold bar above the name of the skill. If you wish to level these further, you will need to gain more Character Levels.
</details>

### How do I start the Main Story Quest? I went to Helgen but it is intact!
<details>
  <summary>Expand</summary>

This mod uses _Alternate Perspective_, in which you can observe and walk through Helgen's destruction as a neutral bystander. To witness Alduin's first attack in centuries, travel to Helgen and choose the "Rent A Room (Start Intro)" option. Then sleep in the bed that the innkeeper offers you for at least one hour. The intro will begin as soon as you step outside. Bear in mind it is important to complete this step relatively early as many later quest stages rely on it. See the question below.
</details>

### Certain quests (especially the Creation Club quests) will not start or complete!
<details>
  <summary>Expand</summary>

A lot of quest stages in later quests are directly reliant on **ALL** the quest triggers -- including event, interaction, and location-based triggers -- being activated during the intro sequence in which Alduin destroys Helgen. If you are finding that Uthgerd will not brawl with you, Ysolda will not ask you for the mammoth tusk, you can't talk to the Creation Club pets, or _Saints and Seducers_ NPCs are not responding, go back and trigger Helgen (as explained in the Note you find in the staring room).
</details>

### I'm not receiving the extra Thane weapons from Balgruuf (or others, when I complete their quests).
<details>
  <summary>Expand</summary>

These quests are all on a rather buggy time delay. I don't know why, but this has been confirmed with multiple user reports, and it happens in clean game with LOTD and just its patches. If you want to receive all the Thane weapons legitimately, do not delay in completing their quests. For Balgruuf, do Helgen almost from the beginning of the game and complete everything up through Mimilnur (the first dragon attack) as soon as you can. Otherwise you won't get them. For the other Thane quests, don't mess around after you start them. Complete them and get the weapons - otherwise you will have to console them in.
</details>

### WARNING! DON'T LISTEN TO ORLANDO!
<details>
  <summary>Expand</summary>

Upon entering a certain inn, you will be given the option to stab a certain Vigilant of Stendarr with a Needle. **DO NOT DO THIS.** This is basically a means by which veterans to the `VIGILANT` mod can skip 3/4 of the mod to get to the fun stuff at the end. You will be _extremely_ underpowered and _utterly_ clueless as to what is going on if you do this. **SO DON'T DO IT!!** No, there is no way back. You will have to load from before you did what the obviously evil dude told you to do.
</details>

### I love the paraglider mod, but I keep dying when I land!
<details>
  <summary>Expand</summary>

Known bug I'm afraid, I guess it doesn't always perfectly detect the landing event. To prevent this, just make sure you always close and reopen the paraglider right before you land. And, of course, always save before you jump!
</details>

### The tuning gloves in Winterhold seem to be acting up.
<details>
  <summary>Expand</summary>

Try removing them and equipping them in between attempts. I dunno either, man.
</details>

### The Civil War questline is horribly messed up. I can't complete the Battle(s) of Whiterun / Solitude / Windhelm. People are inverting backwards off the ground. Enemies don't stop spawning. There's no Ulfric/Tullius!
<details>
  <summary>Expand</summary>

The _Civil War_ questline is incredibly broken even in vanilla Skyrim partially due to the large actor count and infinitely spawning enemies. Pile on CGO scripting all attack patterns and animations and Ultimate Dodge scripting all movement and you have a recipe for disaster. Even if you do manage to complete it, countless other quests will be broken due to destroyed buildings / dead NPCs / flagged variables. **It's recommended that you complete this questchain near the very end of your playthrough**, if at all. If you choose to do so, I recommend keeping the following things in mind:

1. Infinite enemy spawns are based around the destructible barricades. Hit them three times with a weapon or Destruction spell to destroy them and stop spawns in that area.
2. The above does not always work. If you find enemies never stop spawning, _sprint_ to the capitol building of the city you are attempting to reclaim (Dragonsreach, Castle Dour, etc) and make your way inside.
3. The conclusion of the Battle for Whiterun / Solitude / Windhelm is triggered by entering this capitol building.
4. You do not need to escort Ulfric, Galmar, Tullius, Likke or anyone else all the way to the capitol building. Sometimes they won't even spawn when you enter the city! Merely entering it yourself is enough. Just as followers appear beside you, so will the faction leaders.
5. Enjoy the rest of your horribly broken playthrough :finnadie:
</details>

### I can't complete the bandit raid quest for Whiterun (or another city)
<details>
  <summary>Expand</summary>

The Quest Objective to keep the Guard Captain alive is **optional** and he is extremely weak. Most likely he will die. You can still complete the quest if he does, you will just not receive any reward from the city (which is a worthless reward not worth the work IMO).
</details>

### I'm trying to kill the Necromancers for Undeath and the quest won't complete.
<details>
  <summary>Expand</summary>

Yeah, this is just a buggy part of this mod, at least when included in a large modlist like this. After clearing the ritual site, try opening console and typing `killall`. That should clear the quest. If that doesn't work, highlight the dead Necromancers and type `resurrect` followed by `killall`. If this STILL doesn't work, you will probably have to repeat this portion until it does.
</details>

## Technical

### I crashed!
<details>
  <summary>Expand</summary>

Slow down there pardner. Skyrim crashes **all the time**, less so in vanilla but more so with over 1000 mods. First make sure it crashes the next time you do the exact same thing. If it does, drop by the support channels on Discord and give as much detail as possible + attach a crashlog, we'd take a look!
</details>

### I'm randomly crashing!
<details>
  <summary>Expand</summary>

You probably don't have enough paged RAM. Skyrim is very badly optimized. Try increasing your pagefile size. Refer to the primary README document for details.
Alternatively, you don't have enough VRAM, if your GPU is less than 8 GB - you'd have to run [VRAMr](https://www.nexusmods.com/skyrimspecialedition/mods/90557).
</details>

### I gave something to a follower and it crashed!
<details>
  <summary>Expand</summary>

Was it less than a full stack of arrows but more than half of that stack of arrows? Yeah, this is a bug and can't be fixed. Don't do that!

If it was something else, first launch the game and try it again. If it happens again report it and tell me which item it was! Preferably with the ID (or screenshot of opened console where you clicked the offending item, it's IDs should be in bottom right)
</details>

### I can't get out of a crafting animation! OR My followers or other characters got stuck somewhere!
<details>
  <summary>Expand</summary>

Bugs such as this are common to many lists, and `moveto player` is the go-to solution. If you get stuck in a crafting or other SFW animation, open the console with the **tilde** key (to the left of the number 1 along the top of your keyboard) and type `player.moveto player`. That will get you out of it. I find that getting stuck in animations is common if you are attempting to craft or do some repetitive animation in first person. The list should switch you to third automatically **but you could try doing so yourself** before mining ores, brewing potions, etc.

If an NPC gets stuck on some landscape or architecture, you can use a similar command. For followers imported into NFF, you can strike the `F6` key to teleport them all to you at once _(especially useful if you are sprinting in the Overworld)_ Keep in mind that "SUPER" followers such as **Inigo** and **Lucien** **CANNOT** be imported into NFF. If other NPCs get stuck, open console just as above, and click on them until they are highlighted in white _(you may need to scroll your mouse wheel until this occurs)_. Then type `moveto player` and they will appear close to you and should be able to continue.
</details>

### I have problems with the camera! Flickering, weird 1st person body clipping! Can't switch to 3rd person!
<details>
  <summary>Expand</summary>

These are all caused by the extremely janky customization that makes first person POV sex under OStim a possibility. You are probably better off disabling both `Improved Camera` and the `Improved Camera INI` in the left pane of MO2. They do not have traditional ESPs, so your save will be fine. For a compromise, you can switch _to_ third person with the `F` key, and _back_ to first person with the scroll wheel.
</details>

### My performance is really terrible, low FPS, input lag during combat!
<details>
  <summary>Expand</summary>

Refer to the primary readme and ensure you meet all the system specification requirements!
You can try [VRAMr](https://www.nexusmods.com/skyrimspecialedition/mods/90557), some DLSS mods or switch to Community Shaders.
</details>

### I can't start an OStim scene or receive errors when attempting to do so!
<details>
  <summary>Expand</summary>

The first thing you can try is navigating to the _OStim_ MCM and selecting the `Update All` option near the bottom left. Close all menus and wait about 60 seconds, then attempt your adult interaction again.

If this doesn't work, perhaps one of the _OStim_ plugins did not install properly via _Wabbajack._ Try right-clicking on the _OStim NG_ mod in _Mod Organizer 2_ and selecting `Reinstall`. There shouldn't be any options to choose, so just click through. Launch the game and attempt your adult interaction again.

If this *STILL* doesn't work, refer to the [readme](/README.md) and keep reinstalling the list until the error messages go away.
</details>

### I can no longer end an OStim scene!
<details>
  <summary>Expand</summary>

Ensure that you **do not have** `Freecam At Start` enabled in _OStim_ MCM. Sometimes this stops functioning properly on long playthroughs.
</details>

### I have a bug that's not in this list.
<details>
  <summary>Expand</summary>

I'm afraid you're going to have to brave the Realm of the Discord Mods. I know. It's a bit like visiting the Swamp of Sadness in _Neverending Story_ which has also just been invaded by an infestation of Rodents of Unusual Size.
</details>

### I added a mod (or mods) and something weird happened.
<details>
  <summary>Expand</summary>

Feed free to stop by our server and **talk about it in the modded support channel**. We're usually willing to help unless you did something crazy like add seven huge quest mods, all available patches for those mods, and all available LOTD patches for those mods and their patches. Then you're on your own! You can always browse _[Lively's Learn To Mod Series](https://github.com/LivelyDismay/Learn-To-Mod)_ to get info on how to change any modlist you want, good luck.

</details>

### There's more than 255 ESPs! Will this thing even launch?
<details>
  <summary>Expand</summary>

Yes. ESPs flagged as ESL don't count. Double click the little number to see how many real ESPs there are.
</details>

### My load order got messed up!
<details>
  <summary>Expand</summary>

I have included backups. Click the swirly arrows. There's one for the load order (right pane) and one for the install order (left pane). Be sure to get the most recent one!
</details>

### I crash in Project AHO when I complete a certain quest!
<details>
  <summary>Expand</summary>

Try this. Load before you start the quest's conclusion. Complete a step. Save. Reload. Complete the next step. Continue until you finish the quest without crashing. I have confirmation that this does work.
</details>

### My quests have started to disappear from my Quest Log.
<details>
  <summary>Expand</summary>

Skyrim uses a very tiny variable to keep track of these. The maximum number of quests you can have, both active **AND COMPLETED,** cannot exceed 255. When this happens, the older quests will start to vanish. _There is no way around this limitation, it is hard-coded into the game._ If you somehow find yourself playing the hundreds of hours required to do this many quests, read and follow the directions in this mod when you first notice the problem: https://www.nexusmods.com/skyrimspecialedition/mods/56130  You can also find a Synthesis / Mutagen version of this Quest Recovery tool if you are more advanced. There is also a Quest Recover MCM you can run to get the missing quests back.
</details>

## For More Information

Visit our Discord server here:
[Vermi's Hub](https://discord.gg/vermishub)
