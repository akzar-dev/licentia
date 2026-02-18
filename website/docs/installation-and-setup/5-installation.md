---
sidebar_position: 5
title: "Installation 2️⃣"
hide_title: true
slug: /installation
description: "Installation instructions for Licentia NEXT Skyrim modlist"
image: ./img/5-installation-social.png
---

# ![Installation](./img/5-installation.png)

---

:::note
Assuming you've **completed** the [Pre-installation](/pre-installation) part, let's get on with the actual install!
:::

---

## ![Start Skyrim and download CC](./img/5-installation/5-1-start-skyrim-and-download-cc.png)

1. **Make sure your Skyrim installation is clean**. If you're not sure that it is clean &mdash; that's how to make it one (or just watch [this video](https://www.youtube.com/watch?v=zQ5uNCKOKmI)).

    :::tip
    **🧼 Clean Skyrim install procedure:**
    1. **DELETE SKYRIM**:
       - Find your game folder and delete everything;
       - Go to Steam and delete the game there.
    2. Press `Win + R`, paste `%localappdata%` in the small window that just opened, hit `Enter`, and in the newly opened Explorer window delete the folder named `Skyrim Special Edition`
    3. Go to `'Documents\My Games\'` and delete `Skyrim Special Edition` folder there.
    4. Install the game via Steam as usual.
    :::

2. **Start the game once**. You'd need to do it through the Skyrim Launcher (settings there don't matter, we just need to get the game registred properly). When the Launcher starts, you'd see a popup like this:
    <img 
        src={require('./img/5-installation/5_1_2_launcher_popup.png').default}
        alt="Skyrim launcher popup prompting first-time setup"
        style={{ maxHeight:120 }}
        className="zoomable"
    />
   Click `OK` and then `PLAY` in Skyrim Launcher.

3. **Download AE content.** When you get to the main menu &mdash; the game would suggest you to download the AE content &mdash; click `DOWNLOAD`:
    <img 
        src={require('./img/5-installation/5_1_3_ae_content_ingame_popup.png').default}
        alt="Skyrim Anniversary Edition content download popup in main menu"
        style={{ maxHeight:200 }}
        className="zoomable"
    />

    :::danger
    **DON'T MINIMIZE THE GAME!** 

    Wait till everything is downloaded and popups stop appearing.
    :::

    :::tip
    If you're not sure that everything downloaded properly _(i.e. you accedentally closed the game while AE content was downloading)_ &mdash; do this:
    - Close the game and launch Skyrim from Steam again
    - Click `Creations`
    - Click `[O] Options` (at the bottom)
    - Click `Download all owned Creation Club Creations`
    :::

---

## ![Create folders and set AV exceptions](./img/5-installation/5-2-create-folders-and-set-av-exceptions.png)

1. **Create a directory for Wabbajack.** Create a directory at the root of one of your Solid State drives (such as `D:\Wabbajack`) where you'd like to install _Wabbajack_ later on.

2. **Create directories for Licentia NEXT and Licentia Downloads.** Now, do the same for Licentia &mdash; e.g. `D:\Licentia NEXT` and `D:\Licentia Downloads`.

    :::warning
    These folders **MUST NOT** be located in a protected folder such as `Program Files` or `Program Files (x86)`, or the installation would fail.

    Also, it's **STRONGLY RECOMMENDED** that these folders are located on a Solid State Drive (SSD) rather than a Hard Disk Drive (HDD) for performance reasons. That's especially important for the installation folder, as the modlist would run from there. Downloads folder can be on a slower drive if necessary (it would only be used during installation and affect only the installation process speed).
    :::

    :::tip
    We're separating the installation folder and downloads folder for two reasons:
    - If you ever need to re-install the modlist, you can just point _Wabbajack_ to the existing downloads folder and it would save you a lot of time and bandwidth.
    - If you ever need to free up some space *(around 150-160 GB)*, you can just delete the downloads folder **AFTER THE INSTALLATION IS FULLY COMPLETE**. But keep in mind that if you ever need to re-install the modlist, _Wabbajack_ will have to re-download everything again.
    :::

3. **Make AV exceptions.**
    :::warning
    Ensure you have set antivirus exceptions for:
    - _Licentia_ folders (`D:\Licentia NEXT` and `D:\Licentia Downloads`)
    - _Skyrim_ vanilla game folder (i.e. `D:\Games\Steam\steamapps\common\Skyrim Special Edition`)
    - _Wabbajack_ folder (i.e. `D:\Wabbajack`)

    Otherwise, the installation **WILL** fail.

    Certain antivirus packages do not properly respect exceptions and cannot be fully disabled (_Webroot_ and _Bitdefender_ are prime examples of such behaviour). These tools **must be uninstalled** from your system.
    :::

---
## ![Install and configure Wabbajack](./img/5-installation/5-3-install-and-configure-wabbajack.png)

1. **Get the Wabbajack app.** Download latest `Wabbajack.exe` [here](https://github.com/wabbajack-tools/wabbajack/releases/latest/download/Wabbajack.exe) and save it to Wabbajack folder we created earlier (i.e. `D:\Wabbajack`).

2. **Start the _Wabbajack_ app.** Start the `Wabbajack.exe` we downloaded earlier, Wabbajack would download its assets and _eventually_ open, just wait for a minute.

3.  **Login to _Nexus_ within the _Wabbajack_ app.** On the main screen click the **GEAR** icon in the bottom left:

    <img 
        src={require('./img/5-installation/5_3_3_wabbajack_main_ui_gear.png').default}
        alt="Wabbajack main screen with Settings gear icon highlighted"
        style={{ maxHeight:300 }}
        className="zoomable"
    />

    Here in the top left corner, click `Log in` near *Nexus Mods* logo:

    <img 
        src={require('./img/5-installation/5_3_3_wabbajack_nexus_BEFORE_login.png').default}
        alt="Wabbajack Nexus Mods login button before sign in"
        style={{ maxHeight:300 }}
        className="zoomable"
    />

    A new window will open inside *Wabbajack*. You'd be directed to Nexus website, login there as usual and click `Authorize` when prompted. Login window will close by itself after authorization.
    In *Wabbajack* UI button for `Log in` will become light-pink with checkmark, indicating successful login.

    <img 
        src={require('./img/5-installation/5_3_3_wabbajack_nexus_AFTER_login.png').default}
        alt="Wabbajack Nexus Mods login status after successful sign in"
        style={{ maxHeight:300 }}
        className="zoomable"
    />

---

## ![Download and install the list](./img/5-installation/5-4-download-and-install-the-list.png)

1. Now after you've successfully logged in, click `Browse lists` in the left menu of _Wabbajack_ UI:

    <img 
        src={require('./img/5-installation/5_4_1_wabbajack_main_ui_browse.png').default}
        alt="Wabbajack left menu with Browse Lists selected"
        style={{ maxHeight:300 }}
        className="zoomable"
    />

2. Select filters on the left &mdash; `Skyrim Special Edition` as a game **(1)**, tick `Show NSFW` and `Show Unofficial Lists` **(2)**, and type `next` in search bar **(3)**. When you see `Licentia NEXT` &mdash; click on its card on the right **(4)**:

    <img 
        src={require('./img/5-installation/5_4_2_wabbajack_filters_and_download.png').default}
        alt="Wabbajack filters set for Skyrim SE and Licentia NEXT search result"
        style={{ maxHeight:300 }}
        className="zoomable"
    />
 
3. In the newly opened window for _Licentia NEXT_, press `Download & Install` button in the bottom left:

    <img 
        src={require('./img/5-installation/5_4_3_wabbajack_click_dowload_install.png').default}
        alt="Licentia NEXT page in Wabbajack with Download and Install button"
        style={{ maxHeight:300 }}
        className="zoomable"
    />
    
    This will download _Licentia's_ **Wabbajack file** in the background, which is basically an installation package.

4. After the Wabbajack file download is complete, you'll see this screen *(it's going to appear automatically)*.

    <img 
        src={require('./img/5-installation/5_4_4_wabbajack_initial_blank_installation.png').default}
        alt="Initial Wabbajack installation window before setting paths"
        style={{ maxHeight:300 }}
        className="zoomable"
    />

    Don't worry about the error at the bottom, it is normal and will be fixed in the next step.

5. In this window, select the install directory we created for Licentia **(1)**, select the downloads directory we created **(2)** _(you can change where downloads would be stored if you want, i.e. on another, slower drive)_, and hit `Install` button **(3)**:

    <img 
        src={require('./img/5-installation/5_4_5_wabbajack_start_installation.png').default}
        alt="Wabbajack install window with install and download paths configured"
        style={{ maxHeight:300 }}
        className="zoomable"
    />

    **This would begin the actual download and installation of the list.**

    You'd see a progress bar at the top, and some installation stats at the bottom. 

    :::note
    Depending on your system specs, the download and installation processes can take a **long time**.
    :::

    :::warning
    There are many different scenarios where _Wabbajack_ would produce an **error**, that's going to look something like this *(this example is for another list for another game, but you get the idea)*:

    <img 
        src={require('./img/5-installation/5_4_5_wabbajack_error_example.png').default}
        alt="Example Wabbajack installation error with log viewer panel"
        style={{ maxHeight:300 }}
        className="zoomable"
    />

    On the **left side** of this window there's an error box that allows you to open full *Wabbajack* log file, which is useful for troubleshooting.

    On the **right side** you'd see a `Log Viewer` that *usually* says something like `Failed to download X` or `Failed to install X`.
    :::

    :::danger
    **DON'T USE** `Retry` button in the bottom right corner!!!
    :::

    :::tip
    **General advice** &mdash; **re-run _Wabbajack_ completely** before seeking assistance.
    _Wabbajack_ will only download and reinstall the minimum necessary to get the modlist working.

    You can find most common *Wabbajack* issues below *(check Logs tab)*:

    | Issue | Solution |
    | :--- | :--- |
    | **Various files beginning with `cc` and ending with `esl` or `esm` failed to download** | You did not purchase the [$20 upgrade to Skyrim](https://store.steampowered.com/app/1746860/The_Elder_Scrolls_V_Skyrim_Anniversary_Upgrade/), and this is not negotiable. Purchase it, verify it, delete it and re-download it if necessary, and try again. | 
    | **Could not download X** | Some Internet providers have difficulty accessing the servers hosting the list's files. Use a VPN (Virtual Private Network) with a terminus set to the United States. Free options include _ProtonVPN_ and _Cloudflare WARP._ If a download gets interrupted, delete all corrupt local copies before trying again. |
    | **Wabbajack could not find my game folder** | _Licentia NEXT_ will not work with a GOG or pirated game version. If you own the game on _Steam_ &mdash; ensure you are not running Wabbajack as an Administrator. **Asking for help with pirated copies of the game will get you banned from Discord Support.** |
    :::

6. When you'd see this at the top of *Wabbajack* &mdash; it means your **installation is complete!**

    <img 
        src={require('./img/5-installation/5_4_6_wabbajack_installation_complete.png').default}
        alt="Wabbajack installation complete message"
        style={{ maxHeight:100 }}
        className="zoomable"
    />

    You can close *Wabbajack* now and proceed to the next step.