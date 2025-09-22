---
title: "Changelog 📑"
hide_title: true
description: "History of Licentia NEXT Skyrim modlist releases"
image: /img/pages/changelog-social.png
---

# ![Changelod](/img/pages/changelog.png)

---
:::info
The versioning system works the following way:
  - **Major** version `13.x.x` - **very significant** update of the list, always **NOT SAVE SAFE** :no_entry:
  - **Patch** version `x.4.x` - also **big updates** usually including scripted mods changes, **NOT SAVE SAFE** :no_entry:
  - **Minor** version `x.x.1` - **small patches/fixes** or save-safe additions/removals, usually **SAVE SAFE** :white_check_mark:
:::

---

## LICENTIA NEXT `13.5.3`

:white_check_mark: **SAVE SAFE** with **Licentia NEXT `13.5.2/13.5.1/13.5.0`** _(not save safe with older versions)_

### Added
- `Natural Waterfalls - AOS - Patch` - 1.0 (makes AOS Waterfall and Rapids volume sliders work with Natural Waterfalls)
- `Sprint Swim Redux SKSE` - 1.0
- `Use Telekinesis on Traps - po3's Papyrus Extender Version` - 0.2.3
- From suggestions:
	- `Object Impact Framework (OIF)` - 1.6.6 (now you can add any OIF based mod easily)(https://discord.com/channels/1201567388248834108/1393622441036611585), also added `Hit to Switch - OIF`

### Removed
- None

### Updated
- `Unofficial Skyrim Special Edition Patch` - 4.3.6 -> 4.3.6a
- `Mfg Fix NG` - replaced deleted version with 1.0.4
- `Embers XD` - 3.1.5 -> 3.1.7
- `Lux` - 6.9 -> 7.0
- `Lux (patch hub)` - 6.9 -> 7.0 (also added missing `Redcap` patch)
- `Imperial Armors and Weapons Retexture SE` - 1.2 -> 2.0.2
- `kryptopyr's Patch Hub` - 4.2.3 -> 4.2.4 (+ Added `Wintersun - TCIY` patch and hidden scripts overwriting `There is No Umbra` DA03 changes)
- `No Grass In Objects` - 1.5.1 -> 1.5.2

### Fixed/Patched
- Fixed Ashfall Cave entrance terrain in Solstheim (https://discord.com/channels/1201567388248834108/1402720433467560107)
- Moved `IED`, `Sanguine Symphony`, `Dismemberment Framework` and `TNG 5` ini's from `Overwrite` to `Licentia NEXT - SKSE Settings & Various Configs` mod
- Fixed DUMMY THICC flame atronach being overwritten by EmbersXD
- Added `Black Cubemaps` to `Water for ENB` (used with ENB Dynamic Cubemaps)
- Fixed DA02 (Boethia's quest) not working (https://discord.com/channels/1201567388248834108/1402323284611305472)
- **KNOWN ISSUE** - Arkngthamz - water is black/grey with no texture when ENB is on. It's the `Water for ENB` issue, I've reported it to the author. He confirmed, waiting for the patch.
- Re-ran Nemesis

---

## LICENTIA NEXT `13.5.2`

:white_check_mark: **SAVE SAFE** with **Licentia NEXT `13.5.1/13.5.0`** _(not save safe with older versions)_

### Added
- `Rally's SMIM Chests` - 1.0 (+ LotD patch) - previously we've had a mismatch of regular and SMIM chests textures causing snow textures to look like ass on them, now it's fixed and looks better
- `GKB Waves For Various Mods` - 1.0
- `Natrual Waterfalls` - 3.2
- `Natural Waterfalls - Majestic Mountains Patch` - 1.3
- `Cathedral - 3D Mountain Flowers Hearthfire Patch` - 2.1
- `Sufficiently Optimized Snowberries 3D` - 0.6

### Removed
- `BakaFactory's Animations for Ostim Standalone` - replaced with Patreon version with permission from BakaFactory
- Custom patch for Ignoble Beds, author of the mod included my patch in the main mod, so no need for it anymore
- `TT - Rustic Brown Board` - 1.1 (part of Triple Triad leftovers, not needed anymore)
- `LOD Mesh Fixes for DynDOLOD` - not needed anymore (was used for `Bright Waterfall Fix for ENB`)
- `Bright Waterfall Fix for ENB` - not needed anymore (replaced with `Natural Waterfalls`)
- `eeekie's Karliah` - reverted to Bijin's AIO version, this one is odd looking and bugged
- `MIC Fluffworks Medium Patch` - caused horses to bug out

### Updated
- `ENB` - updated (technically the same version, silent update from Boris
- `BodySlide and Outfit Studio` - 5.7 -> 5.7.1
- `Mesh Improvement Compilation` - 0.6.1 -> 0.6.2
- `Skyrim Landscape and Water Fixes` - 9.7.1 -> 9.8.0
- `MIC - Major Cities Mesh Overhaul Patch` - 0.5 -> 0.6.1
- `Ignoble Beds - BOS Use Those Blankets patch` - 1.0.7 -> 1.0.9
- `Water for ENB` - 2.10 -> 2.12
- `Unofficial Skyrim Special Edition Patch` - 4.3.5 -> 4.3.6
- `More Adventures For OStim` - 1.1 -> 1.2
- `powerofthree's Tweaks` - 1.13.1 -> 1.14.1
- `powerofthree's Papyrus Extender` - 6.0.3 -> 6.1.1
- `Experience NG` - 3.6.1 -> 3.6.2
- `KR2's Kaidan NPC Overhaul` - 1.2.4 -> 1.2.5 (also now its 1 mod instead of 2)
- `Apocalypse - Magic of Skyrim` - 10.1.3 -> 10.2.1
- `Just Blood - Dirt and Blood Lite` - 1.2 -> 1.3
- `Lovemaking Compendium for OStim Standalone` - 1.17 -> 1.17.1
- `No Grass In Objects` - 1.4 -> 1.5.1
- `GrassControl.ini` - 1.4 -> 1.5 (updated our config as well)

### Fixed/Patched
- Fixed terrain incompatibilities between `Helgen Reborn` and `Alternate Perspective` in Helgen. THERE ARE STILL SEAMS THERE, but at least all objects are visible. I will try to fix them in the future properly if CK stops crashing on me
- Added `The New Gentleman` 4.2.3 fixed .dll and .pdb files to help with disappearing coke can issue
- Fixed map markers from small locations (like Soul Cairn) appearing over the world map (again) (https://discord.com/channels/1201567388248834108/1397398843947089940)
- Fixed chests and snow mask on them clipping
- Fixed Karliah face/skin issues (reverted to Bijin's AIO version, eeekie's one is odd looking and bugged) (https://discord.com/channels/1201567388248834108/1397150457138516018)
- Fixed CC Horses being messed up (https://discord.com/channels/1201567388248834108/1398201945369612288)
- Fixed some of the Hearthfire plants not showing (https://discord.com/channels/1201567388248834108/1399057062624759889)
- Possibly fixed Arcanaeum lighting issues (https://discord.com/channels/1201567388248834108/1396919767658401892)
- Fixed Vokriinator skills (https://discord.com/channels/1201567388248834108/1400974740734218301)
- Fixed Fallowstone cave freeze (and other potential caves too) by adding Lux - No grass in caves patch (https://discord.com/channels/1201567388248834108/1399518820439298070)
- Sort of fixed terrain here (https://discord.com/channels/1201567388248834108/1399907273895313569). Again, when CK would be willing to work - I'll fix it properly
- Re-ran Nemesis
- Re-ran xLodGen and ACMOS, Grass Cache, TexGen, Dyndolod (due to terrain fixes and new waterfalls mod)

---

## LICENTIA NEXT `13.5.1`

:white_check_mark: **SAVE SAFE** with **Licentia NEXT `13.5.0`** _(not save safe with older versions)_

### Added
- `Security Overhaul SKSE - Extra Locks` - 1.0
- `CC Farming - TnE - SLAWF Farming Patch` - 1.5.3
- `Ignoble Beds - BOS Color Variance` - 1.0.7
- `Ignoble Beds - BOS Use Those Blankets patch`- 1.0.7
- `Ignoble Beds - Legacy of the Dragonborn patch` - 1.0.1

### Removed
- `Ignoble Beds - Use Those Blankets patch` - 1.0.7 (replaced with BOS suite above + fixed child beds)
- `Snazzy HD Noble Beds` - 1.2 (Oldrim mod, took an .esp slot, was not compatible with `Use Those Blankets`. Also removed `CACO'S BEDS` patch, not needed anymore. Fully replaced with `Ignoble Beds`)

### Updated
- `Growl - Werebeasts of Skyrim` - 3.2.1 -> 3.3.1
- `Lovemaking Compendium for OStim Standalone` - 1.16 -> 1.17
- Re-ran Nemesis

### Fixed/Patched
- Fixed crash when opening display cases from `Rally's Display Cases` (by adding `Security Overhaul SKSE - Extra Locks` and overwriting Rally's mesh)
- Fixed `Ignoble Beds - BOS Use Those Blankets patch` (it was not working for child beds, now it does. Reported a bug about missing formlists to the author)
- Fixed incorrect cubemap for `shinedull_e.dds`, also reviewed all other cubemaps for consistency
- Added Cache folder for xEdit *properly*
- Some minor terrain and Lux fixes

---

## LICENTIA NEXT `13.5.0`

:no_entry: **NOT SAVE SAFE** with **Licentia NEXT `13.4.1`** _(and any older versions of NEXT/BLACK)_

### Added
- Follower Dialogue Expansion suite:
  - `Follower Dialogue Expansion - Aela the Huntress` - 6.0.2
  - `Follower Dialogue Expansion - Brelyna Maryon` - 3.0.0
  - `Follower Dialogue Expansion - Erik the Slayer` - 2.0.1.1
  - `Follower Dialogue Expansion - Jenassa` - 5.0
  - `Follower Dialogue Expansion - Jordis the Sword-Maiden` - 1.1.3
  - `Follower Dialogue Expansion - Lydia` - 1.4
  - `Follower Dialogue Expansion - Mjoll the Lioness` - 1.3
  - `Follower Dialogue Expansion - Uthgerd the Unbroken` - 2.0
- `Nemesis Creature Behaivour Compatiblity - Main` - 1.4 (+ `Nemesis Creature Behaivour - WereWolf Addon`)
- `Precision Creatures` - 2.41
- `Nordic UI - Tween Menu Reskin and Fixes - Redesign` - 2.1 *(+ disabled gamepad key reminder in Custom Skills Menu MCM)*
- `NORDIC UI - QuickLoot IE Patch` - 1.1 (for `3.4` of QuickLoot IE)
- `Inigo Official Patch SE` - 2.0fe (+ patch for it to work with for `Dovahnique's High Poly Inigo`)
- `Optimised Scripts for OBIS SE` - 1.0.0
- `Optimised Scripts for Vokrii` - 1.0.0
- `Andromeda - SSLR Patch` - 1.0 (removes useless experience speed gains from Andromeda's stones)
- `CritterSpawn Congestion Fix - Script Call Reduction` - 1.3 (overwrites `CritterSpawn Congestion Fix` from `USMP`)
- `High Poly Head UV Stretch Fix (NECK SEAM FIXED)` - 2.0
- `Dual Wield Behavior Fixes` - 2.0 (only Main Nemesis file)
- `Dual Wield Behaviour Fixes - Patches for Perk Mods` - 1.0 (Vokriinator Black Patch)
- `USSEP Nemesis or Pandora Patch` - 1.0
- `Precision - Mysticism Bound Weapons Patch` - 1.0
- `Helgen Reborn Ordinator Patch` - 1.0 (can pass persuasion check now)
- `Interesting NPCs Infinite Loading Screen Freeze Fix - Snapleg Cave - Rift Watchtower` - 0.1.1
- `OMEAR Addition - Ordinator Perks of Skyrim` - 1.8.2 (instead of `Ordinator React Script Patch`, new one is better)
- `Sunrises and Sunsets NAT Addon from dusk till dawn` - 1.0alpha
- `E.C.D. Every Cloud Different NAT Add On` - 1.0beta
- `Carriage Ferry Travel Overhaul useless dock removal - Base Object Swapper - CFTO - BOS` - 0.1
- `Horse Save Load Fix` - 0.2
- `Auri's Mount Thistlefoot Texture Fix` - 0.1.1
- `Windhelm Entrance Offset Fix` - 0.1
- `Unofficial Material Fix` - 1.18
- `Assorted Mesh Fixes` - 0.127
- `Static Mesh Improvement Mod Improvement Mod` - 1.13.1
- `Mesh Improvement Compilation` - 0.6.1 (+ its patches; removed some mods that are included in this; added a ton of other mesh fixes suggested from MIC comments)
- `Mesh patches for Lux and Lux Orbis` - 1.7.1 (for icy things)
- `Simple Snow Improvements (BOS)` - the whole set (4 mods)
- `Stretched Snow Fix - SFF` - 1.0
- `End Game - No Dragon Spawn` - 1.1
- `Blended Roads less bumpiness - Base Object Swapper` - 2.0
- `Landscape and Water Fixes` - 9.7.1 (+ patches)
- `Next-Gen Decapitations` - 1.3.4
- `Core Impact Framework (CIF)` - 1.2.1
- `Fluffworks - Auto Patches` - 2.2 (removed old separate patches)
- `Widescreen Scale Removed` - 1.0.3 (removed old Squish fixes too)
- `Skyshards Tweaks - ESL Patch` - 1.0 (+ removed beacons, lite mode, 1p1, no book, removed full lod patch)

- From suggestions:
	- `Wolf attack animations` - 1.0
	- `Gore - A Companion Mod` - 1.7.5 (+ `Vigilant` addon, `SaSEC`, `Paarthurnax Dilemma` and `RSChildren` patches)
	- `Cult of the World Eater - Dragon Priests Buff Alduin` - 1.3 + `Defeat the Dragon Cult` - 1.0
	- `Sanguine Symphony` - 1.1 (+ added MCM recording to disable visual/sound effects that overlap with DF)

### Removed
- `Improved Follower Dialogue Lydia` (+ `SDA IFD Lydia Patch`) - replaced with `Follower Dialogue Expansion - Lydia`, gives 2 free .esp slots. Also gets rid of mismatched voices/bugged IFDL quests; makes Lydia AA work again;
- `Modern Brawl Bug Fix` - already included in USMP
- `Triple Triad` - bloat, low quality, non-immersive (it's from FF, not TES), and not really fitting the game
- `Interdimensional Chambers` - outdated, not used by players
- `Sidequests of Skyrim` - bloat, we've got notice boards *(+ disabled recruiting dialogue in NFF for random NPCS which also bloats dialogue)*
- `Enchanced Blood Textures` + its retextures - replaced with `Sanguine Symphony`
- `Wizard Hats` - requested to be removed in suggestions by our very own Sentinel
- `Custom Skills Menu - Custom Icons` - AI generated, was suggested to be removed (replaced with `Custom Skills Menu - Icon Replacers` - 1.1)

### Updated
- ENB - updated to latest (v0.503 from 28-05-2025)
- `Synthesis` - 0.32.1 -> 0.35.0 (+ added new [Sleeping Outfit Remover patch](https://github.com/ninjawaffle/SleepingOutfitRemover) by @ninjawaffle instead of nuked old one)
- `xLodGen` - 129 -> 132
- `Dyndolod` (TexGen and Dyndolod) - Alpha-182 -> Alpha-193
- `Dyndolod Resources SE 3` - Alpha-53.1 -> Alpha-57
- `DynDOLOD DLL NG` - Alpha-33 -> Alpha-36
- `Happy Little Trees Add-On - DynDOLOD 3` - 2.1.1 -> 2.1.2
- `QuickLoot IE - A QuickLoot EE Fork` - 3.3.0 -> 3.4.1
- `Completionist Addons` - 2.0.6 -> 2.0.7
- `CoMAP - Common Marker Addon Project` - 4.2.1 -> 4.3.0
- `Nordic UI Active Effects for SkyUI SE` - 1.2 -> 1.3
- `Atlas Map Markers` - 3.0.3 -> 3.0.4
- `Hunters Not Bandits` - 4.1 -> 4.2
- `OBody Next Generation` - 4.2.0 -> 4.3.7
- `OBody Next Generation ORefit JSON Master List` - 2024.04 -> 2025.05
- `Vokriinator Black` - 6.15.1 -> 6.15.3
- `Legacy of the Dragonborn SSE` - 6.8.0 -> 6.10.0
- `Legacy of the Dragonborn Patches (Official)` - 6.7.3 -> 6.11.0
- `Legacy of the Dragonborn - Creation Club Patch Hub` - 6.0.8 -> 6.0.11
- `Legacy of the Dragonborn SSE - The Curators Companion` - 7.0.6 -> 7.0.7
- `Legacy of the Dragonborn - Follower Room Patches` - 4.0.8 -> 4.0.12
- `The Wheels of Lull SE` - 5.2.0 -> 5.3.0
- `Headhunter - Bounties Redone` - 1.56-> 1.57
- `Extended Encounters` - 1.6.8 -> 1.6.9
- `Storm Lightning for SSE and VR` - 1.14.21 -> 1.14.22
- `Simplicity of Snow` - 0.23 -> 0.25
- `Landscape Fixes For Grass Mods` - 5.7 -> 5.8
- `Water for ENB` - 2.0.2 -> 2.10.0
- `Ignoble Beds - A Noble and Upper Class Bed Replacer` - 1.0.6 -> 1.0.7 (+ added `Use Those Blankets` patch)
- `Rally's Display Cases` - 1.0.2 -> 1.0.3
- `Rally's Barrels` - 1.3 -> 1.5
- `Song of the Green (Auri Follower)` - 2.1 -> 2.2 (+ added new Vigilant patch, unfortunately it's not ESLfied yet)
- `Remiel-Custom Voiced Dwemer Specialist and Companion 2` - 1.7.4 -> 1.7.5
- `Redcap the Riekling - A Fully Voice-Acted Immersive Follower and Quest` - 1.4.5 -> 1.4.16
- `Katana - Journey in the Shadows` - 3.0.2 -> 3.0.5
- `Interesting NPCs - Quest Requirement Tweaks` - 1.2.1 -> 1.3.0
- `Serana Dialogue Add-On` - 4.1.1.3 -> 4.2.0
- `SDA Patch Hub SE`- 2.9.4 -> 2.9.6
- `KS Hairdos SSE` - 1.9 -> 1.10
- `CBBE 3BA (3BBB)` - 2.47 -> 2.48
- `The New Gentleman` - 4.0.4 -> 4.2.3
- `Highly Improved Male Body Overhaul` - 5.4.1 -> 5.6.1 (updated core, patches + added `HIMBO V5 - Physics Addon` 5.5)
- `Security Overhaul SKSE - Some More Locks` - 1.0.8 -> 1.0.9
- `Weapon Styles - DrawSheathe Animations for IED` - 2.2 -> 3.0.1
- `Apocalypse - Magic of Skyrim` - 9.4.5 -> 10.1.3
- `Skyrim Revamped Rebalanced and Releveled` - 2.60 -> 2.80
- `kryptopyr's Patch Hub` - 4.1.2 -> 4.2.3
- `Unofficial Skyrim Special Edition Patch` - 4.3.3 -> 4.3.5
- `Unofficial Skyrim Modder's Patch` - 2.6.5 -> 2.6.6
- `Base Object Swapper` - 3.3.1 -> 3.4.1
- `ImGui Icons` - 1.0 -> 1.1
- `PhotoMode` - 1.8 -> 1.9.1
- `Navigator - Navmesh Fixes` - 1.5.8 -> 1.6.1 (+ enabled Oar Grotto fix)
- `Combat Music Fix NG Updated 1170` - 1.1 -> 1.2
- `Comprehensive Attack Speed Patch - SKSE` - 1.1.2.12 -> 1.1.2.14
- `Modex - A Mod Explorer Menu` - 1.1.3 -> 1.2.3
- `I'm Glad You're Here` - 3.3.2 -> 3.4.0
- `CBBE 3BA Vanilla Outfits Redone` - 4.1.0 -> 4.1.8
- `Ancient Nord Armors and Weapons Retexture SE` - 1.1 -> 1.2
- `Dark Brotherhood Armors Retexture SE` - 1.0 -> 1.1
- `Dragon Armors and Weapons Retexture SE` - 2.1 -> 2.2
- `Forsworn Armors and Weapons Retexture SE` - 1.0.1 -> 1.1
- `Glass Armors and Weapons Retexture SE` - 2.1.1 -> 2.2
- `Guards and Stormcloaks Armors Retexture SE` - 1.0 -> 1.1
- `Iron Armors and Weapons Retexture SE` - 2.0.1 -> 2.1
- `Leather Armors Retexture SE` - 1.0 -> 2.0
- `Unique Armors and Weapons Retexture SE` - 1.0.1 -> 1.2
- `Wolf Armor and Weapons Retexture SE` - 1.1 -> 1.2
- `Growl - Werebeasts of Skyrim` - 3.0 -> 3.2.1
- `Denji - A Custom Skills Menu Update` - 1.3 -> 1.4.1
- `Experience NG` - 3.5 -> 3.6.1
- `SPID - NFF - Add Ignore Token to CustomAI Followers` - 1.0.41 -> 1.0.46
- `OStim Standalone - Advanced Adult Animation Framework` - 7.3.4c -> 7.3.5b-hotfix2
- `Missile's IED Preset` - 3.0.3 -> 3.1.2 (updated LN config as well)
- `Better Third Person Selection - BTPS` - 0.7.1 -> 0.8.9
- `Clutter Filter for BTPS` - 1.0.2 -> 1.0.4
- `Skyrim's Paraglider - ZERO(Plus)` - 2.1 -> 3.0
- `Embers XD` - 3.1.0 -> 3.1.5
- `Dismembering Framework` - 1.0.6 -> 1.2.1
- `Vampire Feed Proxy` - 1.2 -> 1.2.1
- `Open Animations Romance and Erotica` - 1.52 -> 1.52.1
- `Lovemaking Compendium for OStim Standalone` - 1.12 -> 1.16
- `Drago's Love Those Neighbours for OStim Standalone` - 1.8 -> 1.9
- `Billyy's animations for Ostim Standalone` - 2.2 -> 3.0.1
- `ORomance Plus SA` - 2.04 -> 2.11 (+ replaced its patches with `ORomance Plus Official Patch Hub` - 1.04)
- `powerofthree's Papyrus Extender 1170` - 5.9 -> 6.0.1
- `Unofficial Skyrim Creation Club Content Patch` - 7.10 -> 8.2.0
- `Tamrielic Distribution` - 1.4 -> 1.4.1
- `New Beginnings - Alternate Perspective Extension` - 1.3.6 -> 1.3.7
- `Lux Orbis (patch hub)` - 4.5 -> 4.6
- `Lux` - 6.8 -> 6.9
- `Lux (patch hub)` - 6.8 -> 6.9
- `Missives - Gray Cowl Patch` - 2.06a -> 2.11
- `CC Farming - Tweaks and Enhancements` - 1.4.4 - 1.5.1 (+ added 1.5 CC Fishing patch)
- `No Grass In Objects` - 1.3 -> 1.4 (+ updated MO2 script to 3.2 and GrassControl.ini to 1.4)

### Fixed/Patched
- Removed unnecessary `BTPS` MCM recording, replaced with proper `FilterStates.json`
- Fixed NAT ENB shadow around the player in 1st person *(changes forwarded from NAT ENB Bizzare Shadow Fix)*
- Hid a few `.dds` from `OBIS Loot` overwriting `Immersive Armors` (to prevent IA from being overwritten by OBIS)
- Replaced `Ordinator for Spell Perk Item Distributor` with SAFE version (Regular, 50% chance)
- Fixed the perk trees and magic (that was lots of work): adjusted custom patches to work with latest `Vokriinator Black` (6.15.3), removed redundant patches for other major perk overhauls
- Fixed Gargoyle's stalking issues (thanks to [this mod](https://www.nexusmods.com/skyrimspecialedition/mods/140831), I made the same edit in our Final NPC's patch)
- Forwarded new/missed fixes from `USSEP` to our custom patches
- Freeze/crash near *Snapleg Cave* is finally fixed by [wSkeever](https://www.nexusmods.com/skyrimspecialedition/users/7064860), what a madman! It has plagued us for years
- Fixed a bug with Lux in Arcaneum (this one [here](https://discord.com/channels/1201567388248834108/1346392888224907274))
- Re-run Nemesis, Bodyslide, TexGen, Dyndolod, xLodGen, ACMOS, Grass Cache (everything basically)

---

## LICENTIA NEXT `13.4.1`
:::note
`13.4.0` is skipped for technical reasons
:::

:no_entry: **NOT SAVE SAFE** with **Licentia NEXT 13.3.2** _(and any older Licentia BLACK)_

### Added
- `Hunters Not Bandits` - 4.1 (because in was removed from USMP and now installed separately)
- Bunch of wSkeever mods removed from USMP and added separately:
	- `No More Blinding Fog - SSE Port` - 0.1
    - `High Gate Ruins Puzzle Reset Fix` - 0.3
	- `College of Winterhold Quest Start Fixes` - 0.4
	- `King Olaf's Fire Festival Not Ending Fix` - 0.1
	- `Magic Student (WIChangeLocation04) Quest Fix` - 0.1
	- `Neloth's Experimental Subject Quest (DLC2TTR4a) Fix` - 0.1
- `DynDOLOD DLL NG and Scripts 3.00` - Alpha-33
- `DyndoLOD FX Glow Accurate Disabler - Quality of Life` - 1.02
- `xLODGen Resource - SSE Terrain Tamriel` - 2.0 (disabled by default, used only for xLodGen + ACMOS)
- `No Grass in Objects` - 1.2.4 + MO2 plugin - disabled by default
- `Worldspaces with Grass SSEEdit Script for No Grass In Objects` - 2.0 (included into xEdit tool directory)
- `Grass Cache Helper NG` - 1.0.1
- `Far Object LOD Improvement Project SSE` - 1.1
- `LOD Unloading Bug Fix` - 0.2
- `ENB Input Disabler` - 1.1.1
- `Know Your Enemy 2` + it's addons
- `Sound Record Distributor` - 1.5.1
- `(ISC SRDified) Immersive Sounds Compendium - Sound Record Distributor...ded` - 2.2
- `Improved Camera SE` - 1.1.1
- `Improved Camera - Sacrosanct patch` - 2.0.1
- `OStim Standalone Improved Camera Configuration - Updated` - 1.1v2
- `OBody NG` - 4.2.0
- `OBody NG ORefit MasterList 2024.04` - 2024.04
- `3BA With Obody Collision Physics Fix` (+ OSMP patch) - 0.0.2
- `300 CBBE 3BA Presets for OBody` - 1.3
- `HIMBO V5 - CC Refits` - 5.4
- `No Spinning Death Animation Merged LITE` - 1.311
- `ORomance Plus Hearthfire Multi Adoptions Patch` - 1.0
- `ORomance Plus Immersive Rejections Patch` - 1.0
- `ORomance Plus NPCs Wear Amulets of Mara Plus Patch` - 1.0
- `ORomance Plus RDO Patch` - 1.0
- `IA Asdasfa - LOTD Sin7 Patch (LOTDv6)` - 1.14.0
- `IA Asdasfa - LOTD Patch` - 1.15.0
- `Growl - Remove Manual Revert Form (for Moonlight Tales Mini)` - 1.0
- `Skyrim's Paraglider - ZERO (Plus)` - 2.1
- `Mu Joint Fix` - 2.1.2 + OStim patch
- `Heels Fix` - 1.9
- `Modex - A Mod Explorer Menu` - 1.1.3
- SMP stuff:
	- `FSMP - Faster HDT-SMP` - 2.5.1 (+ XMLs for SSE)
	- `SMP-NPC crash fix` - 1.0
	- Reinstalled `CBBE 3BA Physcis Reinstaller` with SMP support
	- `Vanilla hair remake` - updated to 1.0.3 (with SMP support)
	- `KS Hairdos - HDT SMP (Physics)` - 1.4.3
	- `Multicolored KS Hairdos Standalone` - 1.0.0
	- `OSmp - Automatic SMP physics toggle for OStim` - 5.0.0
	- `Salt and Wind - KS Hairdo's SMP Retexture` - 3.1
	- `KS Hairdos SMP - Salt and Wind` - 1.0
- `Vanilla Hair Remake - High Poly Head - Expressive Facegen Morphs - Patches` - 3.2
- `OStim Better Blowjobs` - 1.0
- `Nibbles' animations for Ostim Standalone` - 2.2.0
- `Optimised Scripts for Archery Gameplay Overhaul SE` - 1.0
- `No Opposite Gender Animations NG` - 1.1
- `Jump Slide Fix OAR` - 1.0 (+ all it's optionals merged in main mod)
- `Another Jump Animation - OAR` - 1.0
- `Dismembering Framework` - 1.0.6 (+ it's asset packs, 3ba, himbo, CC bone wolf and Wolves of Skyrim)
- `Precision` - 2.0.4
- `ninjawaffle's Licentia Script Hub` - 1.2.0 (thank you @ninjawaffle!)
- From suggestions:
	- `Amorous Adventures Text and Player Dialogue Revision` - 1.3 (+ 1.3a patch)
	- `Wait Menu Redirected AE Support` - 1.0.2AE (added per suggestions, **disabled by default**, sits in Controller Options section)
	- Custom Skills Menu + addons:
		- `Custom Skills Menu - A Custom Skills Framework Unified Menu` - 1.1.7
		- `Denji - A Custom Skills Menu Update` - 1.3
		- `Custom Skills Menu - Custom Icons` - 2.0
		- `Custom Skills - VIGILANT` - 2.0a
	- `Media Keys Fix SKSE` - 1.0.1
	- `Auto Audio Switch` - 1.0.3
	- `Buzz Off - replacer for Spriggan default ambient SFX` - 1.0
	- `VN5NT - BHM Male Preset Pack` - 1.1
	- Animations:
		- `Goetia Animations - Conditional Shouts` - 1.2
		- `Conditional Armor Type Animations` - 1.3c
		- `CATA` addons animations - whole `Leviathan II`, `Vanargand II` and `Goetia` suites for both males and females
		- `Conditional Armor Type Animations for Sneak` - 1.0 (combines various sneak anims and makes them CATA-aware)
	- `Katana - Journey in the Shadows` - 3.0.2 
	  - added Lux and Lux Orbis patch
	  - added 3BA armor conversion from [here](https://www.nexusmods.com/skyrimspecialedition/mods/106158)
	  - removed unique body and skin (now uses 3BA and our skin mod), made a patch for LN
	- `There is No Umbra - Chapter III` - 1.12
	  - added Lux patch 
	  - "Daumbra Exclude" json settings are added to our default IED preset
	- `Serana Re-Imagined` - 2.0
	  - `Hood Plus Hair for Serana Re-Imagined` - 2.0b
	  - `Glowing Eyes for Serana Re-Imagined` - 1.2
	- `Milfactory Remastered - Valerica` - 1.2FE (+ `Milfactory Asset Hub - CBBE - CBBE Special - 3BA` - 2.2)
	- `slightly Better Dust aka Dust not Clouds` - 1.0
	- `Murder of Songbirds` - 1.2
	- Replaced `Positive Undressed Reactions` 1.0 with `Naked Comments Overhaul` 1.01

### Removed
- `Script Optimization and Fixes Compilation` - 1.3.3 (not needed as of USMP 2.6.4+)
- `ISC Creation Club Armor Patches` - 2.01 (not needed with addition of ISC SRDified)
- `Bipolar mesh fix` - own patch, fixed with LotD 6.7.0+
- `HIMBO Creation Club Armor Clothing Refits` - not needed for V5
- `The Wheels of Lull Retexture SE` - not needed with latest WoL
- `Absolutely play death animation`, `female death animation`, `Death Animations from Underdog Animations` - don't like it at all
- Whole `Animated Traversal` suite - causes issues + don't like it personally
- Whole `Junk` section (Necro Pizzeria, Burger Jarl, Taco and Hotdog mods), cause it breaks immersion too much (and one more free .esp slot now!)
- `Thistlefoot Is Totally Stable` - not needed with Auri 2.0+
- `Know Your Enemy Redux` and it's addons - replaced with `Know Your Enemy 2` + it's addons
- `AP - QuickPort Plugin` and `Interdimensional chambers - Alternate Perspective` due to them being incompatible with v4 of AP
- `OStim Tongues no SMP patch` - not needed with SMP
- `Compatibility patch for AGO and XP32` - it was outdated, not needed with IED
- `Maximum Carnage` (+ it's 3BA conversion and skeleton files)
- `Take a Peek` - buggy mod
- `Meeko Reborn` and `Vigilance Reborn` (+ their Attack Dogs patches) - Attack Dogs already overhaul them enough, and that's 2 free slots right there
- `Seranaholic 1.5 High Poly Head Conversion` and `Valerica by rxkx22 - SSE` - replaced with `Serana Re-Imagined` and `Milfactory Remastered - Valerica`
- From suggestions:
	- `JS Rumpled Rugs SE`
	- `Indecent Exposure`
- From polls:
	- `Book of UUNP`
	- `A Cat's Life`
	- `Gladys the Corgi` and `Merlin the Corgi` + their silent patches


### Updated
- ENB - updated to latest (v0.503 from 09-02-2025)
- `Unofficial Skyrim Special Edition Patch` - 4.3.2 -> 4.3.3
- `Unofficial Skyrim Modder's Patch` - 2.6.3 -> 2.6.5 (2.6.4 + 2.6.5 merged over 2.6.4 per instructions)
- `I'm Talking Here` - 1.2 -> 2.0
- `powerofthree's Tweaks` - 1.12.2 -> 1.13.1
- `Photo Mode` - 1.6 -> 1.8
- `Subtitles` - 0.6.1 -> 0.6.2
- `Completionist - Skyrim Completion Tracker (NG)` - 4.1.0.1 -> 4.1.0.8 (+ Added `Completionist Addons` - 2.0.5)
- `Functional Fearsome Fists` - 1.3 -> 2.0
- `Spell Perk Item Distributor` - 6.0.3 -> 7.1.3
- `DynDOLOD Resources SE 3` - Alpha-52 -> Alpha-53.1
- `DynDOLOD TexGen Fixes` - 2.0 -> 2.3
- `DynDOLOD` (TexGen and Dyndolod) - latest Alpha-182
- `xLodGen` - latest Alpha-129
- `Happy Little Trees Add-On - DynDOLOD 3` - 2.03 -> 2.1.1
- `Illustrious Whiterun - Parallax Meshes` - 2.2 -> 2.7 (main meshes file)
- `Illustrious Whiterun 4K` - 2.0 -> 3.4 (merged all the updates files to main mod)
- `Chapter II - Jeremy Soule Inspired Music (by Dreyma Music)` - 3.0 -> 3.6
- `Nyghtfall - Dark Fantasy Music` - 1.92 -> 2.01
- `Audio Overhaul for Skyrim` - 3.4.3 -> 4.1.3 (switched to modern version)
- `CoMAP - Common Marker Addon Project` - 4.1 -> 4.2.1
- `NORDIC UI - Compass Markers Restored` - 1.4.2 -> 1.5.0
- `Infinity UI` - 2.0.2 -> 2.0.3
- `Atlas Map Markers` - 2.7 -> 3.0.3
- `Dynamic Interface Patcher` - 1.0.3 -> 2.1.4
- `QuickLoot IE - A QuickLoot EE Fork` - 2.0 -> 3.3.0
- `Legacy of the Dragonborn SSE` - 6.6.0 -> 6.8.0
- `Legacy of the Dragonborn Patches (Official)` - 6.6.1 -> 6.7.3 (removed SoS patch)
- `Legacy of the Dragonborn - Creation Club Patch Hub` - 6.0.3 -> 6.0.8 (added SoS + Cheese for everyone patch + [this]( https://www.nexusmods.com/skyrimspecialedition/mods/71840))
- `Legacy of the Dragonborn - The Curator's Companion` - 7.0.2 -> 7.0.6
- `Legacy of the Dragonborn - Followers Patch` - 4.0.4 -> 4.8 (attention - Lucien is temporarily removed)
- `Legacy of the Dragonborn - Interesting NPCs Patch` - 1.3.1 -> 1.4.0
- `The Interdimensional Chambers` - 1.1 -> 1.2
- `Splashes of Storms` - 1.3 -> 1.3.1
- `Obsidian Mountain Fog` - 1.01 -> 1.21
- `Shooting Stars SE` - 1.1 -> 1.3
- `Grass FPS Booster` - 6.9 -> 7.9.2
- `Simplicity of Snow` - 0.19 -> 0.23
- `Sigils of Skyrim` - 1.0 -> 1.1 (for both Banners and Shields)
- `Landscape Fixes For Grass Mods` - 5.6 -> 5.7
- `Water for ENB` - 1.89 -> 2.02
- `GKB Waves Reborn` - 3.1 -> 3.1.1
- `Rally's Mods - Shibui Skyrim Recolor 2K` - 1.2.3 -> 2.3
- `wd - Taproots` - 1.1 -> 1.3
- `Trade and Barter SE` - 2.1 -> 2.2
- `SPID - NFF - Add Ignore Token to CustomAI Followers` - 1.0.30 -> 1.0.41
- `Song of the Green (Auri Follower)` - 1.4 -> 2.0.1
- `Song of the Green - Auri Lenka Replacer SE` - 1.1 -> 2.0 (+ updated patches)
- `Xelzaz Follower Core` - 1.11.2 -> 1.13.0
- `Xelzaz Follower HD Texture Pack` - 1.11 -> 1.13.0
- `Xelzaz Anniversary Edition Plugin` - 1.10.1 -> 1.12.0
- `LotD Visual Overhaul - updated esp` - 1.3 -> 1.4
- `PAN_Initiates SE - esl` - 1.1 -> 1.2.1
- `Highly Improved Male Body Overhaul (HIMBO)` - 4.4.1 -> 5.4.5 (+ all patches)
- `Missile's IED Preset` - 2.0.1 -> 3.0.3
- `Heavy Armory - New Weapons` - 6.0.5 -> 6.1.6
- `Hammerfell Armory SE` - 1.4.1 -> 2.0
- `CBBE 3BA Vanilla Outfits Redone` - 3.5.3 -> 4.1.0
- `Immersive Armors - Asdasfa Tweaks and Fixes` - 1.14.2 - 1.15.0 (+ CBBE and HIMBO fixes)
- `Immersive Armor HIMBO Conversion V2` - 2.2.1 -> 2.3
- `Ebony Armors and Weapons Retexture SE` - 2.0.1 -> 2.0.2
- `Forsworn Armors and Weapons Retexture SE` - 1.0 -> 1.1
- `Iron Armors and Weapons Retexture SE` - 1.1 -> 2.0.1
- `Orcish Armors and Weapons Retexture SE` - 1.1 -> 2.0.1
- `Steel Armors and Weapons Retexture SE` - 1.1 -> 2.0
- `Dragon Priests Retexture SE` - 1.0 -> 1.1
- `Wolf Armor and Weapons Retexture SE` - 1.0 -> 1.1
- `Experience` - 3.4.5 -> 3.5.0
- `Mysticism - A Magic Overhaul` - 2.2.4 -> 2.4.2
- `Adamant - A Perk Overhaul` - 5.8.3 -> 5.9.2
- `Path of Sorcery - Magic Perk Overhaul` - 2.7 -> 3.2
- `Skyrim Revamped Rebalanced and Releveled` - 2.57 -> 2.60
- `Vokriinator Black` - 6.14.3 -> 6.15.1
- `Embers XD` - 2.9.4 -> 3.1.0
- `I'm Glad You're Here` - 3.3 -> 3.3.2
- `OStim Standalone - Advanced Adult Animation Framework` - 7.3.3alpha -> 7.3.4c
- `Open Animations 3PP` - 1.12.0-Nex -> 1.12.1-Nex
- `Lovemaking Compendium for OStim Standalone` - 1.9 -> 1.12
- `Drago's Love Those Neighbours for OStim Standalone` - 1.6 -> 1.8
- `ORomance Plus SA` - 1.64 -> 2.04
- `ORomance Plus Open Animations Standalone Patch` - 1.61 -> 2.04
- `Tamrielic Distribution` - 1.3.7 -> 1.4.0
- `Alternate Perspective - Alternate Start` - 3.1.1 -> 4.0.3
- `New Beginnings - Alternate Perspective Extension` - 1.3.1 -> 1.3.6
- `Lux Orbis` - 3.3 -> 4.5 (+ added Lux Orbis - Patch Hub 4.5)
- `Lux - Via` - 1.7 -> 2.2 (+ added Lux Via (patch hub) 2.2)
- `Lux` - 6.4.1 -> 6.8.0
- `Lux - Patch Hub` - 6.7 -> 6.8 (+ added Remiel, 4.3.3 USSEP and latest LotD update files)
- `Wheels of Lull` - 5.1.13.3 -> 5.2.0
- `KR2's Kaidan NPC Overhaul` - 1.1.1 -> 1.2.4
- `kryptopyr's Patch Hub` - 3.4 -> 4.1.2
- `Hand Placed Enemies` -> same version, changed to `no ambushes`
- `The New Gentleman` - 3.0.2 -> 4.0.4

### Fixed/Patched
- Added `Auri - Wintersun + Inigo banter fixed script patch`, which should (hopefully) fix that long standing issue. Please report if it doesn't work!
- `AllNewQuestLines.esp` (the one from [this mod](https://www.nexusmods.com/skyrimspecialedition/mods/72003)) had a deleted navmesh issue, restored it
- Fixed lots of errors and incosistencies in xEdit for custom patches;
- LOTS of Lux patching and fixing old stuff;
- Removed IFDL AA enabler, and added back SDA and IFDL AA disablers; please report any issues with AA quests (especially Elysif)
- [Link to bug](https://discord.com/channels/1201567388248834108/1320452065138442370) - updated `Licentia NEXT Experience INI` to 3.5 config template of Experience NG
- [Link to bug](https://discord.com/channels/1201567388248834108/1307528669677486100) - added `Dragon Stalking Fix`, thanks for the suggestion
- Finally removed Serana's gargoyle for good
- Replaced `Quiet Better Jumping for CGO` with correct version - `Quiet Better Jumping for CGO - Audio Overhaul - Immersive Sounds Integration`
- Updated MCM Recordings (new mods + disabled NPC initiated smooches for Smooches of Skyrim, changed TUDM sneak key to LCtrl)
- Updated controls and hotkey reminder, press `F11` if you're lost (+ added `Licentia NEXT - The Ultimate Control Scheme patch` to fix TUCS reverting our keyboard controls if TUCS is activated for controller support):
	- Sprint - `LShift` instead of `LAlt`
	- Run - `RAlt` instead of `LShift` _(just use `CapsLock`)_
	- Sneak - `LAlt` instead of `LCtrl` (to be used with `TUDM` because it overwrites sneak key, in `TUDM` options sneak key is set to `LCtrl`)
- Re-ran `Nemesis` (added Precision)
- Re-ran `Synthesis` (removed enblight patch cause we use Lux and it's redundant, updated Synthesis to 0.32.1)
- Re-built `bodyslide`
- Created `Grass Cache`
- Re-run `xLodGen`, `ACMOS`, `TexGen` and `Dyndolod`

---

## LICENTIA NEXT `13.3.2`

:white_check_mark: **SAVE SAFE** with **Licentia BLACK `13.3.0/13.3.1`**
(_you'd get missing plugins notification, but it's safe to ignore cause that's just texture mods.)_

### Added
- `Optimised Scripts for Ordinator` - 1.0
- `Optimised Scripts for Apocalypse-Ordinator Patch` - 1.0
- `ENB Anti-Aliasing - AMD FSR 3.1 - NVIDIA DLAA` - 1.2.3 (now TAA is enabled and FXAA is disabled in skyrimperfs.ini) (thanks @CatastrophicApathy)
- `Unique Map Weather` - 1.1.1
- `Feminine Argonian Textures (Chameleon and Lizard) Hotfix [CBBE]` - 3.3.0.Hotfix (helps match the head)
- `Hotkey Reminder` - 1.0.2 (+ custom Licentia NEXT config by @CatastrophicApathy)
- New main menu and loading wallpaper (hid `logo.nif` in Nordic UI , replaced with `Licentia NEXT Main Menu`)

### Removed
- `Weather of World` (superseded by `Unique Map Weather`)
- `The Last Mainmenu Replacer` (replaced with NEXT main menu)
- `Mega Main Menu` (aka `BLACK Main Menu`) (also replaced with NEXT main menu)
- Deorder plugins unnecessary download

### Updated
- `ENB v502` - latest (19 october 2024)
- `Blood of the Ancients - Permanent` - 2.0 -> 2.1
- `Lae'zel A Githyanki Preset (Custom Overlays Included) by Swagmeister` - 1.1 -> 1.2 (and resources too)
- `More Informative Console` - 1.2.1 -> 1.2.2
- `Base Object Swapper` - 3.3.0 -> 3.3.1
- `Dynamic Things Alternative - Base Object Swapper` - 0.2.2 -> 0.3
- `powerofthree's Tweaks` - 1.11 -> 1.12.2
- `powerofthree's Papyrus Extender` - 5.8 -> 5.9
- `Crash Logger SSE AE VR` - 1.14.1 -> 1.15
- `True Directional Movement` - 2.2.5 -> 2.2.6
- `Myrwatch - Editable Home Cells` - 1.0 -> 1.1.1
- `wd - Barrels` - 1.1 -> 1.2.1
- `RUGNAROK - Special Edition` - 1.1 -> 1.1.1
- `(4) Alchemy Station Variants - Persistent Swap ENB` - 1.2.1 -> 1.4.3
- `Ignoble Beds - Noble and Upper Class Bed Replacer` - 1.0.3 -> 1.0.6
- `The Ultimate Control Scheme` - 1.1 -> 1.4
- `Comprehensive Attack Rate Patch - SKSE` - 1.1.2.11 -> 1.1.2.12
- `Camera Persistence Fixes` - 1.0 -> 1.1
- `iWantWindgets` - 1.31 -> 1.33
- `ENB Light - patch for Quick Light SE` - 1.1 -> 1.2
- (`JS Essence Extractor SE`) `JS Essence and Ash Extractors SE` - 1.2 -> 1.3
- `OStim Standalone - Advanced Adult Animation Framework` - 7.3.1a -> 7.3.3a
- `Lovemaking Compendium for OStim Standalone` - 1.7.5 -> 1.9.0
- `Open Animations Romance and Erotica` - 1.51 -> 1.52
- `I'm Glad You're Here` - 3.2.3 -> 3.3.0
- `Animated Forge Water` - 0.8 -> 0.9
- `Merlin the Corgi` - 2.0.6 -> 2.0.7
- `Conditional Dog Barking (OAR)` - 1.2.0 -> 1.2.1
- `SPID - NFF - Add Ignore Token to CustomAI Follower` - 1.0.28 -> 1.0.30
- `Landscape Fixes For Grass Mods` - 5.5 -> 5.6

- Technical tools updates: 
    - `Synthesis` - 0.29.2 -> 0.30.6
    - `xLodGen` 116 -> 127
    - `Bodyslide` 5.6.3 -> 5.7.0

### Fixed/Patched
- `MCM Saved Settings: TUDM` - Target lock to only hostiles by default, Mouse button 4 for target lock
- `MCM Recording: QuickLight` - Holding interact key doesn't lite up the lantern anymore (it messed up the lantern)
- `MCM Recording: I'm Glad You're Here` - Disabled horse interaction (to make mounting quicker)
- In `SSE Display tweaks`:
  ```
  UIFramerateLimitMain = 60
  UIFramerateLimitMainVSyncOff = false
  ```
- **Bugfixes**:
  - Missing pleasure bars (https://discord.com/channels/719714673431150627/1286429263230271549) - added back `Frostfall UI Nordic UI patch` - 1.0 (was mistakenly removed in 13.3.1, now OStim excitement bars should work!)
  - Some helmets were missing (https://discord.com/channels/719714673431150627/1285801684924370985) - fixed by re-running bodyslide
  - Map issues (https://discord.com/channels/719714673431150627/1289321347075407882) - fixed with config (`A Clear Map of Skyrim and Other Worlds (LOD32 ini file)`)and consistency .esp  (`Licentia map consistency fix`)
  - Cows missing fluffworks shader - hid a `highlandcow.nif` from `Fixed Mesh Lightning` that was overriding Fluffworks
  - Missing wall in Midden Cave - hiding `CaveIRWallStraight01.nif` from _Lux_ and letting the _Skyrim Remastered - Caves_ mesh win fixed the problem
- Re-ran Nemesis

---
# ![Old Changelod](/img/pages/old-changelog.png)
---

:::info
This point in the log marks a shift from **Licentia BLACK** to **Licentia NEXT**. 

`Cacophony` stepped down from the project, and `akzar` (me) took over the development.

**NEXT** will keep **BLACK**'s versioning system. 

Old logs are stored on [Github](https://github.com/akzar-dev/licentia/tree/main/backup/old_but_gold/OLD-CHANGELOG.md) for archival purposes to not clutter the website.
:::
---
