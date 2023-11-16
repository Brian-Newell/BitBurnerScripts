# BitBurnerScripts
Scripts I put together to get the job done.

## BruteBackdoor.js
Attempts to backdoor all servers, provided they have root access.  
Avoids the need for Singularity support!!!    

***WARNING*** This feeds directly to the terminal, requiring no other user activity while it runs. :/

'So grab some grub choom and relax!'

### Examples
```js
[home/] run BruteBackdoor.js
[home/] run BruteBackdoor.js --timeout 1 --maxwait 360
```

### Flags
```
--timeout: default 1; wait time, in seconds, between "Backdoor ... success..." checks
--maxwait: default 360; max wait time, in seconds, for "Backdoor ... success..." checks, or error
```
