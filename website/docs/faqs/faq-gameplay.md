---
sidebar_position: 1
title: "Gameplay FAQ 🎮"
hide_title: true
slug: "/faqs/gameplay"
description: "Gameplay FAQ for Licentia NEXT Skyrim modlist"
image: ./img/faq-gameplay-social.png
---

# ![Gameplay FAQ](./img/faq-gameplay.png)

---

:::tip
If you don't find the answer here - visit our Discord server for further assistance:
[Vermi's Hub](https://discord.gg/vermishub)
:::

### What are the controls in the list?
<details>
  <summary>Expand</summary>

At any point in the game, you can press `F11` to open the controls menu. 

This will show you all the controls for the game, including those added by mods. You can also find the controls in the `MCM` for each mod that adds specific controls.
</details>

### I don't have one of those ancient NUMPADs! How am I gonna use OStim?
<details>
  <summary>Expand</summary>

The _OStim_ controls can be remapped in the `MCM` for that mod. It may be difficult to find enough free keys without a NUMPAD though.
</details>

### Where are my Screenshots?
<details>
  <summary>Expand</summary>

Any screenshot you make is located inside this directory:

`your_Licentia_installation_folder/Stock Game`
</details>

### Leveling up is weird!
<details>
  <summary>Expand</summary>

This modlist uses a modified version of _[Static Skill Leveling](https://www.nexusmods.com/skyrimspecialedition/mods/89940)_ which changes how you level up your skills and attributes.

Generally speaking, the prompt to level up your skills will appear after you level up.

Some advice:

- **Pick skills first**, then pick **Health, Magicka or Stamina**. DON'T pick the attributes first, or you will not be able to pick skills this level at all!

- **Not working?** The `Uncapper` preset prevents skills from leveling beyond your level +18, to a maximum of twice your level. If your skill won't go up any further, try gaining a level!

- **Skill not leveling up upon reading a skill book?** Make sure you're not at the cap, then check for any debuffs to skill gain on your magic effects tab. Take care of those, then try again.
</details>

### I can't level up my skills!
<details>
  <summary>Expand</summary>

This is due to a _Static Skill Leveling_ conflict. 

- If you have _any_ effect on your character that either reduces or increases Skill XP by any amount, the point distribution will seem to work, but nothing will actually increase in the Statistics menu.

- This will also prevent Skill Books from increasing Skills.

- Most commonly this is due to XP penalties from survival-related debuffs, so before leveling up, make certain you take care of all your physical needs.

- You might also want to verify that you apply your Skill Points only when all similar effects are inactive.

- If you have made certain of this and still can't get Skill Points, ensure that you are not at the Skill Cap for your race. The cap can be identified in the Statistics menu as a red or gold bar above the name of the skill. If you wish to level these further, you will need to gain more Character Levels.
</details>

### How do I start the Main Story Quest? I went to Helgen but it is intact!
<details>
  <summary>Expand</summary>

- This modlist uses _[Alternate Perspective](https://www.nexusmods.com/skyrimspecialedition/mods/50307)_, in which you can observe and walk through Helgen's destruction as a neutral bystander. 

- To witness Alduin's first attack in centuries, travel to Helgen and choose the "Rent A Room (Start Intro)" option. Then sleep in the bed that the innkeeper offers you for at least one hour. The intro will begin as soon as you step outside. 

- Bear in mind it is important to complete this step relatively early as many later quest stages rely on it *(see the question below)*
</details>

### Certain quests (especially the Creation Club quests) will not start or complete!
<details>
  <summary>Expand</summary>

- A lot of quest stages in later quests are directly reliant on **ALL** the quest triggers &mdash; including event, interaction, and location-based triggers &mdash; being activated **during the intro sequence in which Alduin destroys Helgen**.

- If you are finding that Uthgerd will not brawl with you, Ysolda will not ask you for the mammoth tusk, you can't talk to the Creation Club pets, or _Saints and Seducers_ NPCs are not responding, go back and do Helgen.

- I am also extremely skeptical of all starts which skip this part of the game, including the "Dragonborn" start from the dragon statue in the opening room as well as the "Skip Intro" start in the Helgen Inn's basement.

- **THE MOST RELIABLE WAY TO START THE GAME** is to **press the button under the table** in the starting room on your left, and then go through the last bit of the usual intro sequence *(the one where you leave the cave with Ralof/Hadvar)*.
</details>

### I'm not receiving the extra Thane weapons from Balgruuf (or others, when I complete their quests).
<details>
  <summary>Expand</summary>

These quests are all on a rather buggy time delay. I don't know why, but this has been confirmed with multiple user reports, and it happens in clean game with LOTD and just its patches. 

So, how to circumvent this:
- If you want to receive all the Thane weapons legitimately, do not delay in completing their quests. 

- For Balgruuf, do Helgen almost from the beginning of the game and complete everything up through Mimilnur (the first dragon attack) as soon as you can. Otherwise you won't get them. 

- For the other Thane quests, don't mess around after you start them. Complete them and get the weapons - otherwise you will have to console them in.
</details>

### WARNING! DON'T LISTEN TO ORLANDO!
<details>
  <summary>Expand</summary>

- Upon entering a certain inn, you will be given the option to stab a certain Vigilant of Stendarr with a Needle. 
- **DO NOT DO THIS.** This is basically a means by which veterans to the `VIGILANT` mod can skip 3/4 of the mod to get to the fun stuff at the end. You will be _extremely_ underpowered and _utterly_ clueless as to what is going on if you do this. 

- **SO DON'T DO IT!!** No, there is no way back. You will have to load from before you did what the obviously evil dude told you to do.
</details>

### I love the paraglider mod, but I keep dying when I land!
<details>
  <summary>Expand</summary>

- Known bug I'm afraid, I guess it doesn't always perfectly detect the landing event.

- To prevent this, just make sure you always close and reopen the paraglider right before you land. And, of course, always save before you jump!
</details>

### The tuning gloves in Winterhold seem to be acting up.
<details>
  <summary>Expand</summary>

Try removing them and equipping them in between attempts. I dunno either, man.
</details>

### The Civil War questline is horribly messed up. I can't complete the Battle(s) of Whiterun / Solitude / Windhelm. People are inverting backwards off the ground. Enemies don't stop spawning. There's no Ulfric/Tullius!
<details>
  <summary>Expand</summary>

The _Civil War_ questline is incredibly broken even in vanilla Skyrim partially due to the large actor count and infinitely spawning enemies. Pile on CGO scripting all attack patterns and animations and Ultimate Dodge scripting all movement and you have a recipe for disaster. Even if you do manage to complete it, countless other quests will be broken due to destroyed buildings / dead NPCs / flagged variables. **It's recommended that you complete this questchain near the very end of your playthrough**, if at all. 

If you choose to do so, I recommend keeping the following things in mind:

1. Infinite enemy spawns are based around the destructible barricades. Hit them three times with a weapon or Destruction spell to destroy them and stop spawns in that area.
2. The above does not always work. If you find enemies never stop spawning, _sprint_ to the capitol building of the city you are attempting to reclaim (Dragonsreach, Castle Dour, etc) and make your way inside.
3. The conclusion of the Battle for Whiterun / Solitude / Windhelm is triggered by entering this capitol building.
4. You do not need to escort Ulfric, Galmar, Tullius, Likke or anyone else all the way to the capitol building. Sometimes they won't even spawn when you enter the city! Merely entering it yourself is enough. Just as followers appear beside you, so will the faction leaders.
5. Enjoy the rest of your horribly broken playthrough :finnadie:
</details>

### I can't complete the bandit raid quest for Whiterun (or another city)
<details>
  <summary>Expand</summary>

The Quest Objective to keep the Guard Captain alive is **optional** and he is extremely weak. Most likely he will die. You can still complete the quest if he does, you will just not receive any reward from the city (which is a worthless reward not worth the work anyway IMHO).
</details>

### I'm trying to kill the Necromancers for Undeath and the quest won't complete.
<details>
  <summary>Expand</summary>

Yeah, this is just a buggy part of this mod, at least when included in a large modlist like this. 

What you can try is the following:
- After clearing the ritual site, try opening console and typing `killall`. That should clear the quest. 

- If that doesn't work, highlight the dead Necromancers and type `resurrect` followed by `killall`. 

- If this STILL doesn't work, you will probably have to repeat this portion until it does.
</details>