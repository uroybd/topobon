---
{"title":"How to Manage Multiple Git Credential for the Same Provider","aliases":["How to Manage Multiple Git Credential for the Same Provider"],"created":"2023-04-26T14:10:34+06:00","updated":"2023-04-30T14:37:32+06:00","dg-publish":true,"dg-note-icon":3,"tags":["technical","how-to"],"dg-path":"Writings/Technical/HowTos/How to Manage Multiple Git Credential for the Same Provider.md","permalink":"/writings/technical/how-tos/how-to-manage-multiple-git-credential-for-the-same-provider/","dgPassFrontmatter":true,"noteIcon":3}
---

> [!tip] A much better way!
> **Thanks to [Sarim Khan](https://github.com/sarim), here's a much better way:**
> 
> > Thats a nice hack. Great to see people still writing bash script in 2023 (i'm not the only bash user left in the universe yay :D). Though git itself has better solution for this.
> > 
> > For example I have this in my ~/.gitconfig
> > 
> > ```gitconfig
> > [include]
> > path = .gitconfig-personal      
> > 
> > [includeIf "gitdir:~/macromanhq/**/.git"]
> > path = .gitconfig-mcm
> > ```
> > 
> > So personal and company(can be multiple) have dedicated gitconfig. In those config you can set different name, email, gpg signing key, sshCommand and whatever else you need :)
> > 
> > Also If you use this, no need to manually fix your IDE to different git path :)

We often use multiple accounts from the same git provider (e.g. GitHub or GitLab). I myself, use different accounts for personal and official works in GitLab. Naturally, I set up ssh keys for both. It is much more convenient than typing a password on every interaction. Problem is  I can't use one ssh key for all my accounts! There are solutions to this problem based on ssh config [like this](https://gist.github.com/oanhnn/80a89405ab9023894df7). One have to be careful while cloning. Also, submodules may need extra work.

Here's how I solved this problem. Once set up, you can forget about you ever set up this!

This solution is kind of **opinionated** and makes the assumption that **you keep your work, and personal repositories separated in different directories**.

## Let's Proceed
### Know Your Current Git Path
Simply by running:

```bash
which git
```

You can find where your git currently resides. In my case, it was in `/usr/bin/git`.

### Create Your Shadow Git
In a local path of your user (e.g. `~/bin`, make sure that it is added to the `PATH`) create a file named `git` with the following content with necessary adjustments:

```bash
#!/usr/bin/env bash

office_repos_regex="^(/Users/uroybd/repos|/Volumes/sources)/office-projects.*"

if [[ $PWD =~ $office_repos_regex ]]; then
  env GIT_SSH_COMMAND="ssh -i ~/.ssh/id_ed25519_official" /usr/bin/git $@
else
  /usr/bin/git $@
fi
```

> [!warning] Points to Note
> 1. We're assuming that your *Personal SSH key* is the default one of your system. Therefore, we need to use the official key (`~/.ssh/id_ed25519_official`) when we are in the `office-projects` directory.
> 2. Notice the `office_repos_regex`. You should modify it based on your structure.
> 3. Replace `/usr/bin/git` with the git path you got from [[Personal/Writings/Technical/HowTos/How to Manage Multiple Git Credential for the Same Provider#Know your current git path\|here]].
> 4. Replace `~/.ssh/id_ed25519_official` with your *Official SSH key*.

It is a simple script to identify if you're in an official repository and use official ssh key for all git commands.

Now give it the necessary permission with:

```bash
chmod u+x ~/bin/git
```

**It's done!**

### Bonus: VS Code Setup
Visual Studio Code should pick up your shadowed git automatically. If not add one such entry in your `settings.json`:

```json
{
...
"git.path": [
  "/Users/uroybd/bin/git", // Your shadow git [Don't add this comments]
  "/usr/bin/git" // The original git, just in case.

]
...
}
```