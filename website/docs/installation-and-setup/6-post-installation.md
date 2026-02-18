---
sidebar_position: 6
title: "Post-Installation 3️⃣"
hide_title: true
slug: /post-installation
description: "Post-installation instructions for Licentia NEXT Skyrim modlist"
image: ./img/6-post-installation-social.png
---

# ![Post-Installation](./img/6-post-installation.png)

---

:::note
Assuming you've **completed** the [Installation](/installation) part, let's continue with post-installation!
:::

---

## ![Fix High DPI Scaling](./img/6-post-installation/6-0-fix-high-dpi-scaling.png)

1. Navigate to your Licentia NEXT installation directory, open the `Stock Game` folder, right click `SkyrimSE.exe` and left click `Properties` on the bottom:
    <img 
        src={require('./img/6-post-installation/6_0_1_skyrimse_properties.png').default}
        alt="SkyrimSE properties"
        style={{ maxHeight:150 }}
        className="zoomable"
    />

2. In the newly opened _Properties_ window, navigate to `Compatibility` tab:
    <img 
        src={require('./img/6-post-installation/6_0_2_skyrimse_compatibility.png').default}
        alt="SkyrimSE.exe Properties window on Compatibility tab"
        style={{ maxHeight:100 }}
        className="zoomable"
    />

3. Click on `Change High DPI settings`:
    <img 
        src={require('./img/6-post-installation/6_0_3_skyrimse_highdpi.png').default}
        alt="SkyrimSE.exe Compatibility tab with Change high DPI settings button"
        style={{ maxHeight:250 }}
        className="zoomable"
    />

4. In the newly opened _High DPI Settings_ window tick `Override High DPI scaling behavior` **(1)**, in the dropdown list select `Application` **(2)**, and then click `OK` two times (for this window and the _Properties_ one that was in the background) to save your changes **(3)**:
    <img 
        src={require('./img/6-post-installation/6_0_4_skyrimse_application.png').default}
        alt="High DPI settings window with Override and Application options enabled"
        style={{ maxHeight:250 }}
        className="zoomable"
    />

:::warning
**IF YOUR MONITOR IS 60 HZ OR LOWER** *([here's a guide](https://www.corsair.com/us/en/explorer/gamer/monitors/how-to-check-your-monitor-refresh-rate/) on how to check that)*, you would need to apply `VSync` *(Vertical Sync, or Vertical Synchronization)* to `SkyrimSE.exe` to avoid screen tearing in-game.

To do that, open your **NVIDIA Control Panel** (or AMD equivalent), navigate to `Manage 3D settings` **(1)**, switch to `Program Settings` tab **(2)**, find `SkyrimSE.exe` in the drop-down list of programs **(3)**, set `Vertical sync` to `On` for it **(4)**, and click `Apply` to save the changes **(5)**:
    <img 
        src={require('./img/6-post-installation/6_0_5_vsync.png').default}
        alt="NVIDIA Control Panel vertical sync settings for SkyrimSE.exe"
        style={{ maxHeight:300 }}
        className="zoomable"
    />
:::

---

## ![Start MO2 and launch the list](./img/6-post-installation/6-1-start-mo2-and-launch-the-list.png)

1. Navigate to your Licentia NEXT directory and **execute** `ModOrganizer.exe`:
    <img 
        src={require('./img/6-post-installation/6_1_1_mo2_start.png').default}
        alt="Mod Organizer 2 (MO2) executable in the Licentia NEXT folder"
        style={{ maxHeight:150 }}
        className="zoomable"
    />

    :::tip
    **IF YOU CAN'T FIND** the `ModOrganizer.exe` despite *Wabbajack* telling you the install finished successfully &mdash; for example your folder looks like this:
        <img 
            src={require('./img/6-post-installation/6_1_1_no_mod_organizer.png').default}
            alt="Licentia NEXT folder example where Mod Organizer 2 (MO2) is missing"
            style={{ maxHeight:300 }}
            className="zoomable"
        />
    Go back to [Installation](installation#download-and-install-the-list) and keep re-installing _Licentia NEXT_ until you see that `ModOrganizer.exe` file appeared in your Licentia NEXT's folder.

    **THIS IS NOT A LICENTIA NEXT ISSUE, IT'S A WABBAJACK ISSUE** since version `4.0`+. We can't do anything about it, sorry.
    :::

2. If prompted, choose `Yes` to associate Mod Organizer with `.nxm` links. If there’s no prompt, **skip this step**.

3. In the top-right corner, make sure that `SKSE` is selected from the dropdown **(1)**, and click the Run button **(2)**:
    <img 
        src={require('./img/6-post-installation/6_1_3_mo2_run_the_game.png').default}
        alt="Mod Organizer 2 (MO2) with SKSE selected and Run button highlighted"
        style={{ maxHeight:100 }}
        className="zoomable"
    />

    :::tip
    Wabbajack auto-detects and sets your **game resolution**, but if you wish to change it **manually/or if the game is launching with the wrong one** &mdash; select the `INI Editor` from the `Tools` menu along the icon bar of MO2:
        <img 
            src={require('./img/6-post-installation/6_1_3_mo2_change_resolution.png').default}
            alt="Mod Organizer 2 (MO2) Tools menu with INI Editor option"
            style={{ maxHeight:150 }}
            className="zoomable"
        />

    Select `SkyrimPrefs.ini` file. Scroll down until you see the `[Display]` header and look for the `iSize` values. Note that the TYPICAL ORDER IS REVERSED, the HEIGHT is listed BEFORE the WIDTH:
        <img 
            src={require('./img/6-post-installation/6_1_3_mo2_change_resolution_skyrimprefs.png').default}
            alt="SkyrimPrefs.ini display section with iSize values in Mod Organizer 2 INI Editor"
            style={{ maxHeight:300 }}
            className="zoomable"
        />

    Hit `Save` at the bottom, and you're done!
    :::

4. Wait untill the game loads, **it might take a while!** 
    :::note
    There's a game of `Flappy Dragon` that opens up while your Skyrim is loading:
    <img 
        src={require('./img/6-post-installation/6_1_4_flappy_dragon.png').default}
        alt="Flappy Dragon loading mini-game window while Skyrim initializes"
        style={{ maxHeight:250 }}
        className="zoomable"
    />
    Don't worry, _you didn't just download half a terabyte of Flappy Dragon_!

    It's there just to brighten up the waiting time :dragon_face:
    :::

5. When you're in the **main Skyrim menu** &mdash; proceed to the next step.

    :::tip
    If your game menu looks **zoomed in** and/or **too small** &mdash; read the resolution section above and make sure you've applied the `High DPI Scaling` fix [at the top of this page](#fix-high-dpi-scaling)!

---

## ![Start the new game](./img/6-post-installation/6-2-start-the-new-game.png)

1. **Start the new game** &mdash; in main menu as normal by pressing `New Game`

2. **Create & name your character** &mdash; choose your character’s appearance and name.

3. **Wait for mod initialization and list auto-configuration**
    :::note
    Since `13.4.1` Licentia NEXT has a **fully automated** list configuration process thanks to our own amazing [@ninjawaffle](https://next.nexusmods.com/profile/ninjawaffle1?gameId=1704)! 

    It would take some time to complete, but you won't have to do anything manually.
    :::

    :::caution
    When you spawn in after character creation, **YOU WON'T BE ABLE TO CONTROL YOUR CHARACTER UNTILL THE LIST HAS FINISHED ITS AUTO-CONFIGURATION!**

    - You will be greeted with this pop-up message:
        <img 
            src={require('./img/6-post-installation/6_2_3_greetings_message.png').default}
            alt="Greetings message from automation script"
            style={{ maxHeight:300 }}
            className="zoomable"
        />

    - Read it, click `OK` and wait. The list will now **auto-configure itself**!
    :::

    :::tip
    **This may take a while**, depending on your PC _(from 5 minutes on fast PCs to 20 on slow ones)_. Don't worry, it's normal, just wait.
    :::

    - You'll see various mods being auto-configured in the **top-left corner** of the screen:
        <img 
            src={require('./img/6-post-installation/6_2_3_mods_config_messages.png').default}
            alt="Mod configuration in progress"
            style={{ maxHeight:150 }}
            className="zoomable"
        />

    - And our automatic script will send these notifications **every 15-20 seconds** to let you know that we're still in progress:
        <img 
            src={require('./img/6-post-installation/6_2_3_our_config_messages.png').default}
            alt="Auto-configuration progress"
            style={{ maxHeight:150 }}
            className="zoomable"
        />

    - When the auto-configuration is done, you'll see this pop-up message:
        <img 
            src={require('./img/6-post-installation/6_2_3_auto_config_finished.png').default}
            alt="Finished message from automation script"
            style={{ maxHeight:300 }}
            className="zoomable"
        />

    - Next you'd be offered a **divine blessing** with **LVL 5** and/or **1000 gold**. Choose according to your preference:
        <img 
            src={require('./img/6-post-installation/6_2_3_final_gift.png').default}
            alt="Divine blessing"
            style={{ maxHeight:150 }}
            className="zoomable"
        />

         **THE LIST IS COMPLETELY CONFIGURED NOW!**

4. Save your game by pressing `F5` *(or from the main menu)*, exit the game **COMPLETELY TO THE DESKTOP**, start it again via MO2 as described above in step 3, and load that save.

5. Follow these **recommended steps** on how to *properly* leave the starting room and **begin your playthrough**:

    - **LOOT THE ROOM** for any valuables you may find!
    
    - Then walk to the **table on your left** and **interact** with the `How to start the game!` note on it:
        <img
            src={require('./img/6-post-installation/6_5_find_note.png').default}
            alt="Start tips - Find the note"
            style={{ maxHeight:300 }}
            className="zoomable"
        />

    - **Read the note** for a detailed explanation on how to start the game, and **take it** when you're done reading *(it would be stored in your inventory so you can read it later if you want to)*:
        <img 
            src={require('./img/6-post-installation/6_5_read_note.png').default}
            alt="Start tips - Read the note"
            style={{ maxHeight:300 }}
            className="zoomable"
        />

    - Now approach the **Shrine of Akatosh** on your right and **interact** with it:
        <img 
            src={require('./img/6-post-installation/6_5_shrine_of_akatosh.png').default}
            alt="Start tips - Shrine of Akatosh"
            style={{ maxHeight:300 }}
            className="zoomable"
        />

    - You would be prompted with the **game start** choices. Here's the example of the **recommended** choices for the **normal** game start:
        <img 
            src={require('./img/6-post-installation/6_5_recommended_choice_1.png').default}
            alt="Start tips - Recommended choice step 1"
            style={{ maxHeight:300 }}
            className="zoomable"
        />

        <img 
            src={require('./img/6-post-installation/6_5_recommended_choice_2.png').default}
            alt="Start tips - Recommended choice step 2"
            style={{ maxHeight:300 }}
            className="zoomable"
        />

    - After you've made your choices, the interface window would **auto-close**. **Go** to the door on the right and **open** it:
        <img 
            src={require('./img/6-post-installation/6_5_door.png').default}
            alt="Start tips - Door"
            style={{ maxHeight:300 }}
            className="zoomable"
        />

    - You'd see the **black void** behind the door - **walk STRAIGHT into it**:
        <img 
            src={require('./img/6-post-installation/6_5_door_void.png').default}
            alt="Start tips - Door Void"
            style={{ maxHeight:300 }}
            className="zoomable"
        />

        Now **if you've followed the recommended steps above**, you'd be asked about a choice between *Hadvar* and *Ralof* - choose *Ralof* here *(it would give you an additional `Amorous Adventures` quest with his sister)*:
            <img 
                src={require('./img/6-post-installation/6_5_recommended_choice_3.png').default}
                alt="Start tips - Recommended choice step 3"
                style={{ maxHeight:300 }}
                className="zoomable"
            />

        And you'll be teleported to the **starting location** you chose in the previous step *(end of Helgen Keep for this particular choice)*.

        :::tip
        If you've chosen any random **NON-DRAGONBORN** start, make sure to **carefully re-read** the part of the `How to start the game!` note that explains how to avoid potential issues with such starts, and how to do **Helgen** to trigger the main quest.
        :::

5. **That's it!** You're now in the world of Skyrim, go play the game already :birthday: *(and read the [Final Notes](/final-notes) for more beginner tips and tricks)*.
