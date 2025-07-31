---
title: 'Clearing WSL Disk Space'
date: '2024-02-06'
description: 'For the pesky HuggingFace caches'
published: true
---

So you use WSL and are continuously losing space on your precious SSD. The following steps may help you recover some of that.

### Tools

Firstly some tips on how to see what exactly is eating up your gigabytes.

Use:

```bash
du -h --max-depth=1 | sort -rh
```

to list how much space each folder is taking up within a directory, sorted in descending order.

For example, here is the output for my `~/.cache` folder:

```bash
~/.cache
❯ du -h --max-depth=1 | sort -rh
28G     .
18G     ./pypoetry
7.7G    ./pip
521M    ./tortoise
485M    ./ms-playwright
478M    ./pnpm
381M    ./mozilla
107M    ./pre-commit
47M     ./typescript
7.6M    ./yarn
1.7M    ./jedi
1.6M    ./deno
1.3M    ./omf
416K    ./fontconfig
180K    ./tooling
72K     ./torch
36K     ./quarto
32K     ./matplotlib
32K     ./librosa
28K     ./huggingface
20K     ./giget
16K     ./com.vercel.cli
16K     ./checkpoint-nodejs
12K     ./black
8.0K    ./pylint
8.0K    ./dconf
4.0K    ./starship
```

### Heuristics

Some things to look out for!

1. Nuke `~/.cache` immediately. Most of your tooling likely has downloaded many large files within this directory.

2. `.venv` or `venv` folders within your Python projects. These folders contain all the packages you `pip install` / `poetry add`. Things like `torch` & `transformers` take up a ton of space, especially the the additional packages installed for CUDA compatibility.

3. `node_modules` folders within your NodeJS projects. Same as (2). Btw, use `pnpm`.

### Still don't see any increase in space?

Restart, or do this to refresh the mounted WSL virtual disk.

```powershell
wsl --terminate ubuntu

# this should spawn another shell, ie: the diskpart CLI
diskpart

DISKPART> select vdisk file=%USERPROFILE%\\AppData\\Local\\Packages\\CanonicalGroupLimited.UbuntuonWindows_79rhkp1fndgsc\\LocalState\\ext4.vhdx
DISKPART> compact vdisk
```

> This exact path might not work for you. It depends on which Linux distribution / version you have installed. Go to `C:\Users\{your_user}\AppData\Local\Packages\...` to browse around and look for the `ext4.vhdx` file. Credit to this guy on [Reddit](https://www.reddit.com/r/bashonubuntuonwindows/comments/goodh4/deleting_a_directory_in_wsl_to_free_up_disk_space/)

Now, you should see the space savings reflected in your file explorer.
