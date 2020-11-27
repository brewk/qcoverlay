This thing displays your weapon % for the day to the right of weapons on screen.
Only works for non-custom/non-arena modes.

Users in your twitch channel can request stats for other players by typing:
!stats playername
 or
!compare playername

results: http://i.imgur.com/aVUKq51.png


** SETUP **
Open overlay.js with a text editor (notepad is fine) and change the settings at the top.

Install the font allstar4 from here to better match ingame font:
https://www.dafont.com/allstar4.font


In OBS make a browser source and point it to the index.html with these settings:

Width 1280
Height 720
FPS 30  (doesn't matter)
custom CSS nothing
[enable] Shutdown source when not visible 
[enable] Refresh browser when the scene becomes active 

- If you stream at 1080, 4k or what ever, grats.. stretch the canvas to match your OBS canvas. You still need to set it to the above settings because that's just how it is.
