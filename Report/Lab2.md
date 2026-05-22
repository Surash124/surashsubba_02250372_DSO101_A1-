# DSO101 – Lab 2: Linux Command Exploration and Basic System Operations




### Aim

To explore and perform basic Linux operations using the terminal — navigation, file management, searching, networking, and process management.



### Theory

Linux is an open-source operating system widely used in servers and cloud environments. Instead of clicking around a GUI, everything is done by typing commands in the terminal (CLI). Its file system starts from a single root (/) and branches out like a tree, and everything — even hardware — is treated as a file.



## Commands Used

### Navigate

```bash
pwd          # where am I?
ls -l        # what's in here? (detailed)
cd folder    # go into a folder
cd ..        # one level UP from where you are
cd ../..     # two levels UP from where you are
cd -         # go back to previous directory (like a back button)
cd /         # jump directly to root from anywhere
tree         # see entire folder structure at once
```

### Files

```bash
touch notes.txt           # create an empty file
echo "text" > file.txt    # create file with content (overwrites existing)
echo "text" >> file.txt   # add to existing file without deleting content
cat file.txt              # read entire file at once
less file.txt             # read file page by page (q to quit)
cp file.txt folder/       # copy file into a folder
mv file.txt newname.txt   # rename a file
mv file.txt folder/       # move a file into a folder
rm file.txt               # delete a file
```

### Folders

```bash
mkdir foldername          # create a folder
mkdir -p parent/child     # create nested folders in one go
rm -r foldername          # delete folder and everything inside it
```

### Search

```bash
grep "word" file.txt       # search for a word inside a file
find folder -name "*.txt"  # find files by name inside a folder
```

### Processes

```bash
ps           # see currently running processes
top          # live view of all processes with CPU and RAM usage
kill <PID>   # stop a process using its ID
```

### System

```bash
whoami          # shows current logged-in user
uname -a        # shows system and kernel info
ping google.com # tests if network is working
```



## Reflection

1. Linux is important because most servers, cloud platforms, and DevOps tools (like Docker and Jenkins) run on it — so knowing the terminal is essential.
2. We used the lts tag because it is stable and recommended — latest is newer but may have bugs.
3. Successfully accessed Jenkins dashboard at localhost:8080 and unlocked it using the password from /var/jenkins_home/secrets/initialAdminPassword.