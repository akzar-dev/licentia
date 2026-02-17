---
sidebar_position: 5
title: "LOD Generation Guide 🌄"
hide_title: true
slug: /guides/lod-generation
description: "How to generate xLODGen, Grass Cache, TexGen and DynDOLOD for Licentia NEXT"
image: ./img/lod-generation-guide-social.png
---

# ![LOD Generation Guide](./img/lod-generation-guide.png)

---

# 🌄 How to Generate LODs for Licentia NEXT

:::note
**WHY YOU MIGHT NEED THIS?**

You added or updated:
- worldspaces
- terrain mods
- grass mods
- tree mods
- city or landscape overhauls

Any of the above **requires regenerating LODs** to avoid visual glitches, missing terrain, or pop-in.
:::

These are the general steps to **regenerate LODs** for **Licentia NEXT**:
1. xLODGen + ACMOS
2. Grass Cache
3. TexGen + DynDOLOD
4. Final cleanup

:::tip
:clock1: Total time: **~2–3 hours**, depending on your PC.
:::

---

## Step :one: — General Preparation
:::tip
This block applies to everything below, so **read carefully**!

:clock1: Expected time to prepare everything is just **~5** minutes!
:::
1. Create a folder at the root of your drive (i.e. `C` drive), let's call it `_DYNDOLOD`, and create 3 folders inside it:
   - `C:\_DYNDOLOD\DynDOLOD_Output`
   - `C:\_DYNDOLOD\SSELODGen_Output`
   - `C:\_DYNDOLOD\TexGen_Output`

   That's what you should get:
    <img 
        src={require('./img/lod_generation_guide/1_1_output_folders_created.png').default}
        alt="Creating output folders"
        style={{ width:'auto', maxHeight:150 }}
        className="zoomable"
    />
   :::tip
   Make sure **they are empty!** *(in case it's not the first time you're doing this process)*
   :::

2. On the top right of MO2 near the `Run` button click on the list to open it *(usually SKSE is pre-selected there)* and select `Edit`, like this:
   <img 
        src={require('./img/lod_generation_guide/1_2_edit_executables.png').default}
        alt="Editing Executables"
        style={{ width:'auto', maxHeight:150 }}
        className="zoomable"
    />

    Here you would need to go through the list of tools we'd use in this guide, and **make sure** their outputs *(which is the `-O:"some_path"` parameter)* are set to the folders you've created in the first step in the `Arguments` field, like this:

    - For `xLODGenx64` it should be `-O:"C:\_DYNDOLOD\SSELODGen_Output"`:
      <img 
         src={require('./img/lod_generation_guide/1_2_xlodgen_settings.png').default}
         alt="xLODGen Settings"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />
    - For `TexGenx64` it should be `-O:"C:\_DYNDOLOD\TexGen_Output"`:

      <img 
         src={require('./img/lod_generation_guide/1_2_texgen_settings.png').default}
         alt="TexGen Settings"
         style={{ width:'auto', maxHeight:180 }}
         className="zoomable"
      />
    - For `DynDOLODx64` it should be `-O:"C:\_DYNDOLOD\DynDOLOD_Output"`:

      <img 
         src={require('./img/lod_generation_guide/1_2_dyndolod_settings.png').default}
         alt="DynDOLOD Settings"
         style={{ width:'auto', maxHeight:175 }}
         className="zoomable"
      />

3. As the last step before we begin - make sure to exclude those `*.exe` files both as a "process" and as a "file" for your Anti Virus software:
   - `xLODGenx64.exe` - located inside `your_LN_installation/tools/xLodGen`
   - `TexGenx64.exe` - located inside `your_LN_installation/tools/DynDOLOD`
   - `DynDOLODx64.exe` - also located inside `your_LN_installation/tools/DynDOLOD`
   - `Texconvx64.exe` - has many locations, either find all or exclude only as a process

   :::warning
   Failing to **exclude** these files may lead to UNEXPECTED ERRORS, which you won't be able to get any help with.
   :::

---
## Step :two: — xLODGen + ACMOS
:::info
Before you begin - please understand that `xLODGen` and `ACMOS` should **always** be run one after another.

Don't just run `xLODGen` and skip `ACMOS`!
:::

---

### Run xLODGen
:::tip
:clock1: Expected time: **25–30 minutes**
:::

1. Open your `Mod Organizer 2`, and in the left pane find and **disable** the following mods:
   - `Licentia NEXT - xLODGen Output`
   - `Licentia NEXT - TexGen Output`
   - `Licentia NEXT - DynDOLOD Output`
   - `DynDOLOD FX Glow Accurate Disabler - Quality of Life`
   - `Grass Cache Helper NG`
   - `No Grass In Objects` (should be already disabled)
   - `Config INI - GrassControl.ini`
   - `Licentia NEXT - Grass Output`

2. Then **enable**:
   - `xLODGen Resource - SSE Terrain Tamriel`

3. Select `xLODGenx64` from the executable dropdown at the top-right of MO2 and hit `Run`:
      <img 
         src={require('./img/lod_generation_guide/2_3_start_xlodgen.png').default}
         alt="Starting xLODGen"
         style={{ width:'auto', maxHeight:100 }}
         className="zoomable"
      />

4. `xLodGen` window would open. It can take a while to load, don't worry! 

   In the *"Select Worldspace(s) to generate LOD for"* section on the left **check everything**. This can be done by right-clicking anywhere in the worldspaces list and choosing `Select All`:
   <img 
      src={require('./img/lod_generation_guide/2_4_xlodgen_select_all_worldspaces.png').default}
      alt="Selecting all worldspaces in xLODGen"
      style={{ width:'auto', maxHeight:180 }}
      className="zoomable"
   />

5. In the main window make sure **only** `Terrain LOD` is checked:
      <img 
         src={require('./img/lod_generation_guide/2_5_xlodgen_only_terrain_lods.png').default}
         alt="Running LAA"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

6. Select `LOD4` under `Terrain LOD` and set the following options:
      <img 
         src={require('./img/lod_generation_guide/2_6_xlodgen_lod4_settings.png').default}
         alt="xLODGen LOD4 Settings"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

      <details summary="Text version of LOD4 settings">

         <p>From left to right, top to bottom:</p>

         - `Build meshes` - Checked
            - `Quality` - 0
            - `Max Vertices` - 32767
            - `Optimize Unseen` - 500
            - `Protect Borders` - Checked
            - `Hide Quads` - **NOT** checked
         - `Build diffuse` - Checked
            - `Size` - 256
            - `Format` - BC7 Quick
            - `MipMaps` - Checked
            - `Brightness` - 0
            - `Contrast` - 0
            - `Gamma` - 1.25
         - `Build normal` - Checked
            - `Size` - 256
            - `Format` - BC7 Quick
            - `MipMaps` - Checked
            - `Raise steepness` - Checked
         - `Bake normal maps` - Checked
            - `Bake specular` - **NOT** checked
            - `Vertex Color Intensity` - 1.00
            - `Default size: Diffuse` - None
            - `Default size: Normal` - None

      </details>

7. Select `LOD8` under `Terrain LOD` and set the following options:
      <img 
         src={require('./img/lod_generation_guide/2_7_xlodgen_lod8_settings.png').default}
         alt="xLODGen LOD8 Settings"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

      <details summary="Text version of LOD8 settings">

         <p>From left to right, top to bottom:</p>

         - `Build meshes` - Checked
            - `Quality` - 4
            - `Max Vertices` - 32767
            - `Optimize Unseen` - 525
         - `Build diffuse` - Checked
            - `Size` - 256
            - `Format` - BC7 Quick
            - `MipMaps` - Checked
            - `Brightness` - 0
            - `Contrast` - 0
            - `Gamma` - 1.25
         - `Build normal` - Checked
            - `Size` - 256
            - `Format` - BC7 Quick
            - `MipMaps` - **NOT** checked
            - `Raise steepness` - **NOT** checked
         - `Bake normal maps` - Checked
            - `Bake specular` - **NOT** checked
            - `Vertex Color Intensity` - 1.00
            - `Default size: Diffuse` - None
            - `Default size: Normal` - None

      </details>

8. Select `LOD16` under `Terrain LOD` and set the following options:
      <img 
         src={require('./img/lod_generation_guide/2_8_xlodgen_lod16_settings.png').default}
         alt="xLODGen LOD16 Settings"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

      <details summary="Text version of LOD16 settings">

         <p>From left to right, top to bottom:</p>

         - `Build meshes` - Checked
            - `Quality` - 6
            - `Max Vertices` - 32767
            - `Optimize Unseen` - 625
         - `Build diffuse` - Checked
            - `Size` - 256
            - `Format` - BC7 Quick
            - `MipMaps` - Checked
            - `Brightness` - 0
            - `Contrast` - 0
            - `Gamma` - 1.25
         - `Build normal` - Checked
            - `Size` - 256
            - `Format` - BC7 Quick
            - `MipMaps` - **NOT** checked
            - `Raise steepness` - **NOT** checked
         - `Bake normal maps` - Checked
            - `Bake specular` - **NOT** checked
            - `Vertex Color Intensity` - 1.00
            - `Default size: Diffuse` - None
            - `Default size: Normal` - None

      </details>

9. Select `LOD32` under `Terrain LOD` and set the following options:
      <img 
         src={require('./img/lod_generation_guide/2_9_xlodgen_lod32_settings.png').default}
         alt="xLODGen LOD32 Settings"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

      <details summary="Text version of LOD32 settings">

         <p>From left to right, top to bottom:</p>

         - `Build meshes` - Checked
            - `Quality` - 0
            - `Max Vertices` - 32767
            - `Optimize Unseen` - 550
         - `Build diffuse` - Checked
            - `Size` - 2048
            - `Format` - BC7 Quick
            - `MipMaps` - Checked
            - `Brightness` - 0
            - `Contrast` - 0
            - `Gamma` - 1.25
         - `Build normal` - Checked
            - `Size` - 2048
            - `Format` - BC7 Quick
            - `MipMaps` - **NOT** checked
            - `Raise steepness` - **NOT** checked
         - `Bake normal maps` - Checked
            - `Bake specular` - **NOT** checked
            - `Vertex Color Intensity` - 1.00
            - `Default size: Diffuse` - None
            - `Default size: Normal` - None

      </details>

10. After you've set all LOD levels' settings - make sure `Seasons` are **NOT** checked **(1)**, and click `Generate` **(2)** at the bottom-right of the window:
      <img 
         src={require('./img/lod_generation_guide/2_10_xlodgen_generate.png').default}
         alt="Generating xLODGen"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

11. Now you just have to **wait** for approximately 25-30 minutes (depending on your PC, this may take up to an hour, depends on the CPU). You can track the time passed on the top bar of the `xLODGen` window!

      **When the process is finished**, you would see the `LOD generation done` message at the bottom of the main window:

      <img 
         src={require('./img/lod_generation_guide/2_11_xlodgen_done.png').default}
         alt="Finished xLODGen"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

      **Close** the `xLODGen` window and **proceed** to the next step (ACMOS).
---

### Run ACMOS Road generator
:::tip
:clock1: Expected time: **2–3 minutes**
:::
1. Select `ACMOS Road generator` from the executable dropdown at the top-right of MO2 and hit `Run`:
      <img 
         src={require('./img/lod_generation_guide/2_1_acmos_start_acmos.png').default}
         alt="Starting ACMOS"
         style={{ width:'auto', maxHeight:100 }}
         className="zoomable"
      />

2. In the newly opened `ACMOS` window select `Paths Only` in the `Select Roads` dropdown menu:
      <img 
         src={require('./img/lod_generation_guide/2_2_acmos_paths_only.png').default}
         alt="ACMOS Paths Only selected"
         style={{ width:'auto', maxHeight:170 }}
         className="zoomable"
      />

3. Now click `Browse` near the `Path for LOD` string: 
      <img 
         src={require('./img/lod_generation_guide/2_3_acmos_paths_to_lod_browse.png').default}
         alt="ACMOS Paths to LOD browse"
         style={{ width:'auto', maxHeight:170 }}
         className="zoomable"
      />

4. Navigate to the `C:\_DYNDOLOD` folder we've created in the [Preparation](#step-one--general-preparation) step **(1)**, click **ONCE** on your `SSELODGen_Output` folder **(2)**, make sure its name appeared at the bottom and click `Select Folder` **(3)**:
      <img 
         src={require('./img/lod_generation_guide/2_4_acmos_paths_to_lod_folder.png').default}
         alt="ACMOS Paths to LOD select folder"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

5. Note that the `C:\_DYNDOLOD\SSELODGen_Output` is visible in both `Path to LOD` and `Output Path` **(1)**, and click `Generate` **(2)**!
      <img 
         src={require('./img/lod_generation_guide/2_5_acmos_generate.png').default}
         alt="ACMOS Generate"
         style={{ width:'auto', maxHeight:170 }}
         className="zoomable"
      />

      You would be greeted by an `Overwrite LOD Textures?` Warning - click `Yes`.
      <img 
         src={require('./img/lod_generation_guide/2_5_acmos_warning.png').default}
         alt="ACMOS Generate Warning"
         style={{ width:'auto', maxHeight:100 }}
         className="zoomable"
      />

      And wait till the generation completes (it would take just a few minutes).

6. When the generation is **finished**, you would see a `Zip?` message - click `No`:
      <img 
         src={require('./img/lod_generation_guide/2_6_acmos_zip.png').default}
         alt="ACMOS ZIP"
         style={{ width:'auto', maxHeight:100 }}
         className="zoomable"
      />

      After that you'd see the `All Done!` message - click `Ok`:
      <img 
         src={require('./img/lod_generation_guide/2_6_acmos_done.png').default}
         alt="ACMOS Done"
         style={{ width:'auto', maxHeight:100 }}
         className="zoomable"
      />

7. You can now close the `ACMOS Road Generator` and proceed to the next step.
---

### Install xLODGen + ACMOS Output

1. Navigate to your `C:\_DYNDOLOD\SSELODGen_Output` folder, you would see two folders there:
   - `meshes`
   - `textures`

2. Now:
   - Add those 2 folders *(not the `SSELODGen_Output` folder itself)* to archive (via 7zip or any other tool) in `.zip` format
   - Copy the resulting archive to your *Licentia* downloads folder (for example `C:\Licentia NEXT\Downloads`).

3. In the `Mod Organizer 2`, you would see the `SSELODGen_Output.zip` at the `Downloads` section on the right. If you don't see it - click `Refresh` on the left.
      <img 
         src={require('./img/lod_generation_guide/2_3_final_mo2.png').default}
         alt="Find xLODGen output in MO2"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

4. Double-click the `SSELODGen_Output.zip`, and when prompted for `Quick Install` - just press `Ok`:
      <img 
         src={require('./img/lod_generation_guide/2_4_final_install.png').default}
         alt="Install xLODGen output in MO2"
         style={{ width:'auto', maxHeight:100 }}
         className="zoomable"
      />

      It would take a minute, so just wait.

5. The mod would appear at the bottom of the mods' list on the left:
      <img 
         src={require('./img/lod_generation_guide/2_5_final_bottom.png').default}
         alt="Find xLODGen output at the bottom in MO2"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

6. Drag it to the `Licentia NEXT - LOD Output` separator, put it under the disabled `Licentia NEXT - xLODGen Output` mod, and enable it. The result would look like this:
      <img 
         src={require('./img/lod_generation_guide/2_6_final_added.png').default}
         alt="Completed installation of xLODGen output in MO2"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

7. The last step - find and disable the mod - `xLODGen Resource - SSE Terrain Tamriel`.

---

## Step :three: — Grass Cache Generation

:::note
This step is **mandatory** if you changed:
- worldspaces
- grass mods
- landscape records

Original guide reference is available [here](https://github.com/The-Animonculory/Modding-Resources/blob/main/Grass%20Lods.md).
:::

---

### (optional) List worldspaces with grass

:::note
You **only need this** when you've added and/or removed mods with new worldspaces!
:::

:::tip
:clock1: Expected time: **10 minutes**
:::

General idea is this - before the grass cache generation, it's needed to determine which worldspaces require generation and which can be ignored.

1. In the `Mod Organizer 2`, select `xTESEdit64` in the dropdown on the top-right and click `Run`:
      <img 
         src={require('./img/lod_generation_guide/3_worldspaces_1_xedit.png').default}
         alt="Listing worldspaces - Open xEdit"
         style={{ width:'auto', maxHeight:120 }}
         className="zoomable"
      />

2. You would be greeted with the `Module Selection` window - make sure all the plugins are selected *(they usually are)*, if not - right-click anywhere in the list and click `Select All`. Then click `OK`:
      <img 
         src={require('./img/lod_generation_guide/3_worldspaces_2_xedit_select_all.png').default}
         alt="Listing worldspaces - Select all plugins in xEdit"
         style={{ width:'auto', maxHeight:200 }}
         className="zoomable"
      />

3. Next you'd be asked about `Mod Groups` - just close that window, we won't need them.

4. Now, right-click anywhere on the left part of `xEdit` and press `Apply Script`:
      <img 
         src={require('./img/lod_generation_guide/3_worldspaces_4_xedit_apply_script.png').default}
         alt="Listing worldspaces - Apply Script"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

5. In the opened `Apply Script` window select the `List worldspaces with grass` script from the dropdown list **(1)**, and click `Ok` **(2)**:
      <img 
         src={require('./img/lod_generation_guide/3_worldspaces_5_xedit_apply_script_run.png').default}
         alt="Listing worldspaces - Apply Script - Run listing"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

      If you get the debug files window - just click `Ok`.

      :::tip
      Now you just wait! The script may run for a while (15-20 minutes).
      :::

6. When the script finishes, you would be greeted with this new window:
      <img 
         src={require('./img/lod_generation_guide/3_worldspaces_6_xedit_apply_script_done.png').default}
         alt="Listing worldspaces - Apply Script - Done listing"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

      **Copy the contents** of this message box! Either just in your buffer or some note. 

      Then press `Ok`.

7. Close `xEdit`, find the `Config INI - GrassControl.ini` mod in `Mod Organizer 2`, right-click it and select `Open in explorer`:
      <img 
         src={require('./img/lod_generation_guide/3_worldspaces_7_grass_control_mo2.png').default}
         alt="Listing worldspaces - Open Grass Control folder"
         style={{ width:'auto', maxHeight:50 }}
         className="zoomable"
      />

8. In the opened Explorer window, go inside `SKSE/Plugins` folder, find the `GrassControl.ini` file, and open it with any text editor:
      <img 
         src={require('./img/lod_generation_guide/3_worldspaces_8_grass_control_open_ini.png').default}
         alt="Listing worldspaces - Open Grass Control ini"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

9. In the opened document, find the `Only-pregenerate-world-spaces` property, it would look something like this:
      <img 
         src={require('./img/lod_generation_guide/3_worldspaces_9_grass_control_edit_1.png').default}
         alt="Listing worldspaces - Grass Control ini edit 1"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

      Note that there's a lot of text between the `" "`!

10. Replace everything between the `" "` with the text you copied from `xEdit` earlier. Just **make sure** that after your changes `Only-pregenerate-world-spaces` value is still surrounded by single double quotes (`"`)!

11. **Save** the document and proceed to the next step.

---

### (optional) Recalculate grass bounds

:::note
You **only need this** if you've **CHANGED THE GRASS MOD** and **ONLY IF** this new grass mod doesn't come with grass bounds already calculated *(check your mod's page for details)*.

Any grass records that has no object bounds set will not generate anything during grass pre-caching. This section helps ensure that ALL grass has object bounds data.
:::

:::warning
Note that this process would **require** installing `Creation Kit`!

Also this process presumes that you're using the `Grass FPS Booster` mod for your grass.
If you don't - just ommit anything related to it.
:::

:::tip
:clock1: Expected time: **25–30 minutes**
:::

1. Repeat **steps 1-3** from the [List worldspaces with grass section](#optional-list-worldspaces-with-grass).

2. Right-click anywhere on the left pane and select `Apply Filter`:
      <img 
         src={require('./img/lod_generation_guide/3_grass_bounds_2_apply_filter.png').default}
         alt="Grass bounds - Apply filter"
         style={{ width:'auto', maxHeight:200 }}
         className="zoomable"
      />

3. In the opened `Filter..` window select `by Record Signature` **(1)**, find and select `GRAS - Grass` in the list below **(2)**, and click `Filter` on the bottom-right **(3)**:
      <img 
         src={require('./img/lod_generation_guide/3_grass_bounds_3_apply_filter_params.png').default}
         alt="Grass bounds - Apply filter"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

4. You would see all the plugins having any records of `GRASS` in them. Now we have to create **two NEW** override plugins for grass.
   :::warning
   *Licentia* **already ships** with two grass plugins - `LN_M_Grass_Main` and `LN_M_Grass_Boost`.
   
   You **have to disable/remove/rename** them before starting this step, or just name **your NEW plugins** differently. This guide is a bit more high level, so you'd figure it out.

   Examples below would keep the original naming scheme.
   :::

   - **Main plugin** (`LN_M_Grass_Main`):
      - For each plugin **EXCEPT THE GRASS BOOST ONE** you'd have to open up its grass records **(1)**, right click them **(2)** - in case there are many records you can select them with `Shift` and then right-click - and choose `Copy as Override into...`
         <img 
            src={require('./img/lod_generation_guide/3_grass_bounds_4_copy_as_override.png').default}
            alt="Grass bounds - Override copy"
            style={{ width:'auto', maxHeight:250 }}
            className="zoomable"
         />

      - In the new window scroll to the bottom of the plugin list, select 5th from the bottom called `<new file.esp>` with a `ESL` flag on the right, and click `Ok`:
         <img 
            src={require('./img/lod_generation_guide/3_grass_bounds_4_copy_as_override_target.png').default}
            alt="Grass bounds - Override target"
            style={{ width:'auto', maxHeight:250 }}
            className="zoomable"
         />

      - You'd be asked for a name, choose anything you want (we'd use `LN_M_Grass_Main` in this example), and click `Ok`.

      - Repeat this for all the `GRASS` records, going from bottom to the top! If you get any warnings saying `Add as master?` - say `Yes`.
   - **Boost plugin** (`LN_M_Grass_Boost`):
      - Repeat the same exact steps as for the **Main** plugin above, **BUT** this time **copy everything** including the records from `Grass Boost` plugin. 

      - Call your new plugin something like `LN_M_Grass_Boost`

5. When you're done, hit `Ctrl + S` to save your plugins, and then close `xEdit`.

6. Open your `Creation Kit` in `Mod Organiser 2`:
   - In top left click `FILE` -> `Data...`
   - Select your `LN_M_Grass_Bounds_Main` plugin **(1)**, click `Set as Active` **(2)**, hit `Ok` **(3)** and wait for `Creation Kit` to finish loading:
         <img 
            src={require('./img/lod_generation_guide/3_grass_bounds_6_open_main_in_CK.png').default}
            alt="Grass bounds - Open in CK"
            style={{ width:'auto', maxHeight:250 }}
            className="zoomable"
         />
   - In the `Object Window` find `Grass` and select it **(1)**, then on the right select **ALL** grass records with `Shift + Left Click` on the first and last records **(2)**, right click anywhere and click `Recalc Bounds`:
         <img 
            src={require('./img/lod_generation_guide/3_grass_bounds_6_recalc_main_in_CK.png').default}
            alt="Grass bounds - Recalc Bounds"
            style={{ width:'auto', maxHeight:250 }}
            className="zoomable"
         />

   - Click `FILE` -> `Save`, and then close `Creation Kit`.
   - **Repeat the same process** for the `LN_M_Grass_Bounds_Boost` plugin.

7. Your newly created plugins would be saved in `Overwrite` (or wherever you've set your Creation Kit output to).

   - Move them to an empty mod/wherever you'd like and enable them

   - Make sure they're loaded after all `LN_M_****` and `LN_S_****` plugins on the right in `Mod Organizer 2`

   - `Boost` plugin should be loaded AFTER the `Main` plugin

   **Done!** Now you're **ready to proceed** to the next step.

---

### Preparation

:::tip
:clock1: Expected time: **5 minutes**
:::

1. In `Mod Organizer 2` **enable** the following mods:
   - `No Grass In Objects`
   - `Config INI - GrassControl.ini`

2. Then find the `Grass FPS Booster` mod on the left:
   - Right-click on it and select `Information`
   - In the newly opened window, select `Filetree` tab **(1)**, right click on `Grass FPS Booster - ***your grass mod name***.ini` **(2)**, and click `Hide` **(3)**:
         <img 
            src={require('./img/lod_generation_guide/3_preparation_2_hide_grass_booster_ini.png').default}
            alt="Grass Cache - Preparation - Hide grass booster ini"
            style={{ width:'auto', maxHeight:250 }}
            className="zoomable"
         />

3. And on the right pane in `Plugins` tab **DiSABLE** the following plugins:
   - `Grass FPS Booster - ***your grass mod name***.esp`
   - `LN_M_Grass_Bounds_Boost.esp` (or whatever your `Boost` plugin is called after [Bounds Recalculation](#optional-recalculate-grass-bounds))

   It should look like this:
      <img 
         src={require('./img/lod_generation_guide/3_preparation_3_disable_grass_boosters_plugins.png').default}
         alt="Grass Cache - Preparation - Disable grass boosters plugins"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

4. **Verify** `GrassControl.ini` **settings**.

   They are already preconfigured in *Licentia*, but if you want to double-check - open the `GrassControl.ini` file inside the `Config INI - GrassControl.ini` mod and make sure these values are set:
      <details summary="Licentia NEXT settings that differ from the default GrassControl.ini">

         - `Use-grass-cache = true`
         - `Extend-grass-distance = true`
         - `Extend-grass-count = false`
         - `Ensure-max-grass-types-setting = 15`
         - `Overwrite-min-grass-size = 60`
         - `Global-grass-scale = 1.150000`
         - `Only-load-from-cache = true`
         - `Only-pregenerate-world-spaces = "values from the List Worldspaces with Grass step"`
         - `DynDOLOD-Grass-Mode = 1`
      </details>
---

### Generate Grass Cache

:::tip
:clock1: Grass cache generation **will take a long time** - **1-2** hours is completely normal *(depends on your additions size and/or your PC performance)*.

Some recommend setting your game resolution to `800x600` and disabling `ENB` to speed up the process, but I personally didn't notice any difference *(can still help you speed things up though, won't hurt to try)*.
:::

1. In `Mod Organizer 2` at the top click the `Puzzle` icon **(1)** and hit `Precache Grass` **(2)**:
      <img 
         src={require('./img/lod_generation_guide/3_1_launch_precache_plugin.png').default}
         alt="Grass Cache - Launch MO2 Plugin"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

   You would get a popup warning you about the process details - **READ IT** and click `Ok`:
      <img 
         src={require('./img/lod_generation_guide/3_1_launch_precache_plugin_warning.png').default}
         alt="Grass Cache - Launch MO2 Plugin Warning"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

2. The game would **start now**!
   - The game may load 2-3 times longer than usual, that's normal

   - You'd see this popup when the grass precaching starts - **DON'T CLICK `OK`** in this message, otherwise you won’t be able to monitor the progress:
      <img 
         src={require('./img/lod_generation_guide/3_2_start_cache_message.png').default}
         alt="Grass Cache - Start cache message"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

   - **Open** up the **console** instead with `~`. You'd be able to see the progress of cache generation there:
      <img 
         src={require('./img/lod_generation_guide/3_2_cache_progress_console.png').default}
         alt="Grass Cache - Cache progress in console"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

   - Now you just have to **wait**. The game would just stay at the loading screen and do the grass generation.
   
      If the game **crashes** during generation - precache script would **restart it automatically** as many times as needed, you don’t have to do anything.

      :::warning
      :clock1: This process may take a long time **(up to 2 hours)**, and a few restarts. **Just wait!**
      :::

3. When you see thiis **Windows-style completion message** - grass generation is completed! Just click `Ok`:
      <img 
         src={require('./img/lod_generation_guide/3_3_cache_finished.png').default}
         alt="Grass Cache - Cache finished"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

      Game would close, and in `Mod Organizer 2` you'd see this message - click `Ok` here as well:
      <img 
         src={require('./img/lod_generation_guide/3_3_cache_finished_mo2.png').default}
         alt="Grass Cache - Cache finished MO2"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

      Grass cache generation is **done**! Proceed to the next step.

---

### Install Grass Cache output

1. Find the `Overwrite` folder on the bottom of `Mod Organizer 2`, right-click it and select `Open in Explorer`:
      <img 
         src={require('./img/lod_generation_guide/3_output_1_open_overwrite.png').default}
         alt="Grass Cache - Open Overwrite"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

2. Find the `grass` folder and add it to achive. It has to be `.zip`!

   Then:
   - delete the `grass` folder from `Overwrite` directory
   - move the archive to your *Licentia* downloads folder (for example `C:\Licentia NEXT\Downloads`).

3. In the `Mod Organizer 2`, you would see the `grass.zip` at the `Downloads` section on the right. If you don't see it - click `Refresh` on the left.
      <img 
         src={require('./img/lod_generation_guide/3_output_3_grass_zip_in_downloads.png').default}
         alt="Grass Cache - grass.zip in downloads"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

4. Double-click the `grass.zip`, and when prompted for `Quick Install` - just press `Ok`:
      <img 
         src={require('./img/lod_generation_guide/3_output_4_install_grass.png').default}
         alt="Grass Cache - install grass.zip"
         style={{ width:'auto', maxHeight:100 }}
         className="zoomable"
      />

      It would take 10-20 seconds.

5. The mod would appear at the bottom of the mods' list on the left:
      <img 
         src={require('./img/lod_generation_guide/3_output_5_grass_at_the_bottom.png').default}
         alt="Grass Cache - grass output at the bottom"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

6. Drag it to the `Licentia NEXT - Grass Cache` separator, put it under the disabled `Licentia NEXT - Grass Cache` mod, and enable it. The result would look like this:
      <img 
         src={require('./img/lod_generation_guide/3_output_6_finished_view.png').default}
         alt="Grass Cache - finished view"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

      **Done!** Proceed to the next step.
---

## Step :four: — TexGen + DynDOLOD

:::note
Both `TexGen` and `DynDOLOD` are always run together!
:::

:::tip
:clock1: Expected time: **1 hour**
:::

---

### Preparation

1. Enable the following mods in `Mod Organizer 2`:
   - `DynDolod - Darken texture for generation - The good one last one`

2. Setup `DynDOLOD` configuration:
   - Navigate to `your_LN_installation/tools/DynDOLOD/Edit Scripts/DynDOLOD/` folder, find the `DynDOLOD_SSE.ini` file and open it in any text editor

   - Using `CTRL-F`, search for `Expert`, and set `Expert=1` (default is `0`)

   - Using `CTRL-F`, seach for `Level32`, and set `Level32=1` (default is `0`)

   - Using `CTRL-F`, search for `DoubleSidedTextureMask`. Remove the semi-colon `;` in front of this line. It should now read `DoubleSidedTextureMask=mountain,mtn`.

   - **Save** your changes and **close** the file.

---

### Run TexGen

:::tip
:clock1: Expected time: **10 minutes**
:::

1. Select `TexGenx64` from the executable dropdown at the top-right of MO2 and hit `Run`:
      <img 
         src={require('./img/lod_generation_guide/4_texgen_1_start.png').default}
         alt="TexGen - start"
         style={{ width:'auto', maxHeight:100 }}
         className="zoomable"
      />

      Give it a couple of minutes to load.

2. When `TexGen` is open, **set** its **settings** like this, then click `Start` in bottom right:
      <img 
         src={require('./img/lod_generation_guide/4_texgen_2_options.png').default}
         alt="TexGen - Settings"
         style={{ width:'auto', maxHeight:400 }}
         className="zoomable"
      />

      <details summary="Text version of TexGen settings">

         <p>From left to right, top to bottom:</p>

         - `Select Output Path` - choose your output folder we've created during the [General Preparation](#step-one--general-preparation) step
         - `Stitched Object LOD Textures` - Checked
            - `Base size` - 256 (1440p)
         - `Rendered Object LOD Textures` - Checked
            - `Base size` - 256 (1440p)
         - `Tree/Grass LOD Billboards` - Checked
            - `Units per pixel` - 11.0 (1080p)
            - `Texture size Min` - 32
            - `Texture size Max` - 1024
            - `Grass` - **NOT** checked
            - `HD Grass` - Checked
               - `Direct` - 0
               - `Ambient` - 160
               - `Smoothness` - 0
            - `Tree` - Checked
               - `Direct` - 170
               - `Ambient` - 60
            - `HD Tree` - Checked
               - `Direct` - 170
               - `Ambient` - 60
               - `Smoothness` - 0
            - `Rendered` - Checked
               - `Direct` - 100
               - `Ambient` - 95
               - `Smoothness` - 0
         - `Diffuse Alpha` - Default (BC7 Quick)
         - `Diffuse` - Default (BC7 Quick)
         - `Normal Specular` - Default (BC7 Quick)
         - `Normal` - Default (BC7 Quick)

      </details>

      `TexGen` would run now, it would be fast *(around 5 minutes)*.

3. When `TexGen` finishes running, you'd be presented with this popup - click `Exit TexGen` *(the program would close after)*:
      <img 
         src={require('./img/lod_generation_guide/4_texgen_3_done_exit.png').default}
         alt="TexGen - Exit Done"
         style={{ width:'auto', maxHeight:200 }}
         className="zoomable"
      />

4. **Done!** Proceed to installing its output below.
---

### Install TexGen Output

1. Navigate to your `C:\_DYNDOLOD\TexGen_Output` folder, you would see the `textures` folder there. 

2. Now:
   - Add the `textures` folder *(not the `TexGen_Output` folder itself)* to archive (via 7zip or any other tool) in `.zip` format
   - Copy the resulting archive to your *Licentia* downloads folder (for example `C:\Licentia NEXT\Downloads`).

3. In the `Mod Organizer 2`, you would see the `TexGen_Output.zip` at the `Downloads` section on the right. If you don't see it - click `Refresh` on the left.
      <img 
         src={require('./img/lod_generation_guide/4_3_final_mo2.png').default}
         alt="Find TexGen output in MO2"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

4. Double-click the `TexGen_Output.zip`, and when prompted for `Quick Install` - just press `Ok`:
      <img 
         src={require('./img/lod_generation_guide/4_4_final_install.png').default}
         alt="Install TexGen output in MO2"
         style={{ width:'auto', maxHeight:100 }}
         className="zoomable"
      />

      It would take a minute, so just wait.

5. The mod would appear at the bottom of the mods' list on the left:
      <img 
         src={require('./img/lod_generation_guide/4_5_final_bottom.png').default}
         alt="Find TexGen output at the bottom in MO2"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

6. Drag it to the `Licentia NEXT - LOD Output` separator, put it under the disabled `Licentia NEXT - TexGen Output` mod, and enable it. The result would look like this:
      <img 
         src={require('./img/lod_generation_guide/4_6_final_added.png').default}
         alt="Completed installation of TexGen output in MO2"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

**Done!** Proceed to the next step.

---

### Run DynDOLOD

:::tip
:clock1: Expected time: **50 minutes**
:::

1. In `Mod Organizer 2` at top-right select `DynDOLODx64` from the executable dropdown and hit `Run`:
      <img 
         src={require('./img/lod_generation_guide/4_dyndolod_1_start.png').default}
         alt="DynDOLOD - start"
         style={{ width:'auto', maxHeight:100 }}
         className="zoomable"
      />

      Give it a couple of minutes to load.

2. In the top left section of the new `DynDOLOD Expert` window right-click inside the `Worldspaces` box and choose `Select All`:
      <img 
         src={require('./img/lod_generation_guide/4_dyndolod_2_select_all_worldspaces.png').default}
         alt="DynDOLOD - select all worldspaces"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

3. In the top right section check `Candles` **(1)** and `FXGlow` **(2)**, then click `High` **(3)**. Don't forget to make sure that you've set the output path to the folder we've prepared in [General Preparation](#step-one--general-preparation) step above **(4)** - you can click `...` to select the folder:
      <img 
         src={require('./img/lod_generation_guide/4_dyndolod_3_candles_fx_high_preset.png').default}
         alt="DynDOLOD - select Candles, FXGlow and High preset"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

4. Now we'd work on the `Options` category at the bottom of the screen. **We'd go line by line, left to right, top to bottom** *(the list will be numbered continuously)*:

   - Line **1**:
      <img 
         src={require('./img/lod_generation_guide/4_dyndolod_4_options_line_1.png').default}
         alt="DynDOLOD - Options block line 1"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

      <details summary="Text version of Options block - Line 1">

         **1.** `Object LOD` - Checked

         **2.** `Level32` - Checked

         **3.** `Tree LOD` - **NOT** checked (would uncheck automatically when `Ultra` is checked)

         **4.** `Ultra` - Checked

         **5.** `Dynamic LOD` - Checked

         **6.** `Glow windows` - Checked

         **7.** `High` - Checked

      </details>

   - Line **2**:
      <img 
         src={require('./img/lod_generation_guide/4_dyndolod_4_options_line_2.png').default}
         alt="DynDOLOD - Options block line 2"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

      <details summary="Text version of Options block - Line 2">

         **8.** `Max tile size LOD` - 1024

         **9.** `Billboard brightness` - `-5`

         **10.** `Upgrade NearGrid large references to FarGrid` - Checked

      </details>

   - Line **3**:
      <img 
         src={require('./img/lod_generation_guide/4_dyndolod_4_options_line_3.png').default}
         alt="DynDOLOD - Options block line 3"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

      <details summary="Text version of Options block - Line 3">

         **11.** `Max tile size full` - 256

         **12.** `Max tile size billboard` - 1024

         **13.** `Fake lights child world` - Checked

      </details>

   - Line **4**:
      <img 
         src={require('./img/lod_generation_guide/4_dyndolod_4_options_line_4.png').default}
         alt="DynDOLOD - Options block line 4"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

      <details summary="Text version of Options block - Line 4">

         **14.** `Occlusion data` - Checked

         **15.** `Terrain underside` - Checked

         **16.** `Grass LOD` - Checked

         **17.** `Downgrade FarGrid refrences to NearGrid` - **NOT** checked

      </details>

   - Line **5**:
      <img 
         src={require('./img/lod_generation_guide/4_dyndolod_4_options_line_5.png').default}
         alt="DynDOLOD - Options block line 5"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

      <details summary="Text version of Options block - Line 5">

         **18.** `Quality` - 3

         **19.** `Plugin` - Checked

         **20.** `Density` - 55%

         **21.** `Mode` - 1

         **22.** `Parent > child` - Checked

      </details>

5. Now in the main window's `Mesh and Reference rules` block: scroll down to the `tree` record, double-click it **(1)**, then in the newly opened window change `LOD Level 8` to `Billboard4` and `LOD Level 32` to `Billboard6` **(2)**, and click `Ok` at the bottom right **(3)**:
      <img 
         src={require('./img/lod_generation_guide/4_dyndolod_5_tree_changes.png').default}
         alt="DynDOLOD - Change tree billboards"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

6. In the same main window right under `tree` record there is a `\` recod: double-click it **(1)**, then in the newly opened window change `LOD Level 32` to `Level0` **(2)**, and click `Ok` at the bottom right **(3)**:
      <img 
         src={require('./img/lod_generation_guide/4_dyndolod_6_root_changes.png').default}
         alt="DynDOLOD - Change root billboards"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

7. Now, just double check that `tree` and `\` records are updated for all LOD levels *(basically it's `Level0 -> Billboard4 -> Billboard1 -> Billboard6` for `tree` and `Level0 -> Level1 -> Level2 -> Level0` for `\`)* **(1)**, and click `Ok` to **start the `DynDOLOD` generation!**:
      <img 
         src={require('./img/lod_generation_guide/4_dyndolod_7_check_and_start.png').default}
         alt="DynDOLOD - Check and start"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

      :::warning
      :clock1: This would take **A LONG TIME!**

      Sit back, relax. It would be around an hour.
      :::

8. When the `DynDOLOD` is done generating, you'd see this message - select `Save and Exit` *(and `DynDOLOD` would close after that)*:
      <img 
         src={require('./img/lod_generation_guide/4_dyndolod_8_done_and_save.png').default}
         alt="DynDOLOD - Done and save"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

      :::tip
      `DyDOLOD` will open a page `DynDOLOD_Index.html` in your browser with notes to read its output report containing warnings/errors/etc. - and it can be very useful! Especially if you've added something new.

      For **compeletely vanilla** *Licentia* there are no critical issues there, so you can skip this report.
      :::

9. In `Mod Organizer 2`, **disable** the mod `DynDolod - Darken texture for generation - The good one last one`.

      **Great success!** You're almost done, proceed to the next step.

---

### Install DynDOLOD Output

1. Navigate to your `C:\_DYNDOLOD\DynDOLOD_Output` folder, you would see:
   - **3** folders:
      - `meshes`
      - `SKSE`
      - `textures`
   - **4** files:
      - `DynDOLOD.esm`
      - `DynDOLOD.esp`
      - `DynDOLOD_SWAP.ini`
      - `Occlusion.esp`

2. Now:
   - Add those files and folders *(not the `DynDOLOD_Output` folder itself)* to archive (via 7zip or any other tool) in `.zip` format
   - Copy the resulting archive to your *Licentia* downloads folder (for example `C:\Licentia NEXT\Downloads`).

3. In the `Mod Organizer 2`, you would see the `DynDOLOD_Output.zip` at the `Downloads` section on the right. If you don't see it - click `Refresh` on the left.
      <img 
         src={require('./img/lod_generation_guide/4_3_dyndolod_final_mo2.png').default}
         alt="Find DynDOLOD_Output output in MO2"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

4. Double-click the `DynDOLOD_Output.zip`, and when prompted for `Quick Install` - just press `Ok`:
      <img 
         src={require('./img/lod_generation_guide/4_4_dyndolod_final_install.png').default}
         alt="Install DynDOLOD_Output output in MO2"
         style={{ width:'auto', maxHeight:100 }}
         className="zoomable"
      />

      It would take a couple of minutes to install, so just wait.

5. The mod would appear at the bottom of the mods' list on the left:
      <img 
         src={require('./img/lod_generation_guide/4_5_dyndolod_final_bottom.png').default}
         alt="Find DynDOLOD_Output output at the bottom in MO2"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

6. Drag it to the `Licentia NEXT - LOD Output` separator, put it under the disabled `Licentia NEXT - DynDOLOD Output` mod, and enable it. The result would look like this:
      <img 
         src={require('./img/lod_generation_guide/4_6_dyndolod_final_added.png').default}
         alt="Completed installation of DynDOLOD_Output output in MO2"
         style={{ width:'auto', maxHeight:150 }}
         className="zoomable"
      />

7. In the `Plugins` section on the right, make sure both `DynDOLOD.esp` and `Occlusion.esp` plugins are sorted like this *(they should be loaded last!)*:
      <img 
         src={require('./img/lod_generation_guide/4_7_dyndolod_plugins_order.png').default}
         alt="DynDOLOD Plugins order"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

---

## Step :five: — Finishing Touches

1. In `Mod Organizer 2`, in the left pane **disable** these mods:
   - `No Grass In Objects`

2. Then **enable** these mods:
   - `Grass Cache Helper NG`
   - `DynDOLOD FX Glow Accurate Disabler - Quality of Life`

      Note that this mod activates a new plugin `Dyndolod_Glow_Fix.esp`, which should be loaded **LAST, right after `Occlusion.esp`**!

3. Now find the `Grass FPS Booster` mod on the left:
   - Right-click on it and select `Information`
   - In the newly opened window, select `Filetree` tab **(1)**, right click on `Grass FPS Booster - ***your grass mod name***.ini.mohidden` **(2)**, and click `Unhide` **(3)** *(because we've hidden it earlier and it needs to be reverted)*:
         <img 
            src={require('./img/lod_generation_guide/5_3_unhide_grass_booster_ini.png').default}
            alt="Finishing Touches - Unhide grass booster ini"
            style={{ width:'auto', maxHeight:250 }}
            className="zoomable"
         />

4. And on the right pane in `Plugins` tab **ENABLE** the following plugins we've disabled earlier:
   - `Grass FPS Booster - ***your grass mod name***.esp`
   - `LN_M_Grass_Bounds_Boost.esp` (or whatever your `Boost` plugin is called after [Bounds Recalculation](#optional-recalculate-grass-bounds))

   It should look like this:
      <img 
         src={require('./img/lod_generation_guide/5_2_enable_grass_boosters_plugins.png').default}
         alt="Finishing Touches - Enable grass boosters plugins"
         style={{ width:'auto', maxHeight:250 }}
         className="zoomable"
      />

---

🎉 **Done!**
Your LODs are now fully regenerated!
