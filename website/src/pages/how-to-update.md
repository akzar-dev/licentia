---
title: "How to update 🔄"
hide_title: true
hide_table_of_contents: true
description: "Instructions on how to update Licentia NEXT Skyrim modlist"
image: /img/social-cards/how-to-update-social.png
---

# <span className="licentia-heading licentia-heading--h1">How to update</span>
---

:::tip
Updating the list and re-installing the list are the same thing in _Wabbajack_.

If you're trying to **re-install** an existing setup, use this page.
:::

:::warning
**Your custom added mods may be deleted during the update/re-installation!**

If you want to keep your manually added mods, don't forget to prefix them with `[NoDelete]` in MO2, so _Wabbajack_ won't delete them during the update/re-installation process.

You can also use [this mod](https://www.nexusmods.com/skyrimspecialedition/mods/137095) to automate prefixing.
:::

---

1. Open _Wabbajack_ and click `Browse Modlists` on the left bar:
    <DocImage 
        src={require('/img/pages/how-to-update/1_open_WJ_and_browse_lists.png').default}
        alt="Opening Wabbajack and click Browse Lists"
        style={{ maxHeight:200 }}
        width={2199}
        height={1536}
    />

2. Find _Licentia NEXT_ using `Search` bar on the left *(with `NSFW` and `Non-featured` boxes ticked)* **(1)** and click on _Licentia_ card that would appear on the right **(2)**:
    <DocImage 
        src={require('/img/pages/how-to-update/2_find_LN_and_click_on_it.png').default}
        alt="Finding Licentia NEXT and clicking on it"
        style={{ maxHeight:200 }}
        width={3444}
        height={1098}
    />

3. Click `Download & Install` button on the bottom left *(it will download the updated `.wabbajack` file)*:
    <DocImage 
        src={require('/img/pages/how-to-update/3_click_download_and_install.png').default}
        alt="Clicking Download&Install on Licentia NEXT"
        style={{ maxHeight:250 }}
        width={2076}
        height={1929}
    />

    :::tip
    **if you're re-installing the list** - the text on the button would just say `Install` instead of `Download & Install`, click it:
        <DocImage 
            src={require('/img/pages/how-to-update/3_tip_if_reinstalling_click_install.png').default}
            alt="Clicking Install in case of re-installation"
            style={{ maxHeight:100 }}
            width={1236}
            height={420}
        />
    :::

4. On the left select the same directories you've used for your _Licentia_ install and downloads **(1)** (though usually *Wabbajack* correctly auto-detects them), and click `Install` at the bottom right **(2)**:
    <DocImage 
        src={require('/img/pages/how-to-update/4_select_folders_and_install.png').default}
        alt="Selecting installation directories and clicking install"
        style={{ maxHeight:200 }}
        width={3831}
        height={2013}
    />

5. Now just wait for the process to finish.

    :::note
    _Wabbajack_ will only download what has changed, it will not repeat the entire installation &mdash; so updating/re-installing would be *much* faster than the initial installation.
    :::

    After it's done - **close** _Wabbajack_.

6. Go to your installation folder, open the *Mod Organizer 2* (MO2), and make sure your **mods and plugins count** matches the ones stated in the announcement channel or in the [Changelog](/changelog) for your version of the list.

7. **DONE!** 🥳

    :::danger
    It is rarely recommended to **continue a save** after you update a modlist *(unless an update is labeled `Save Safe` in the changelog/announcement)*!

    Check the [Changelog](/changelog) for more information on the update you are installing, and if it is save safe or not.
    :::
