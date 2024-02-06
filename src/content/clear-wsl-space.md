---
title: 'Clearing WSL Disk Space'
date: '2024-02-06'
description: 'For the large HuggingFace caches ...'
published: true
---

Quickly getting the sizes of each folder in the current directory.

```bash
du -h --max-depth=1
```

Restart, or do this to refresh the mounted WSL virtual disk.

```powershell
wsl --terminate ubuntu
diskpart
DISKPART> select vdisk file=%USERPROFILE%\AppData\Local\Packages\CanonicalGroupLimited.Ubuntu18.04onWindows_79rhkp1fndgsc\LocalState\ext4.vhdx
DISKPART> compact vdisk
```

Credit: https://www.reddit.com/r/bashonubuntuonwindows/comments/goodh4/deleting_a_directory_in_wsl_to_free_up_disk_space/

Now, you should see the space savings reflected in your file explorer.
