** What's that? -> go
* [Other option]
  Other
--- (next_bit)
*	I asked permission to leave[] and Monsieur Fogg looked surprised. 	-> open_door
* 	I stood and went to open the door[]. Monsieur Fogg seemed untroubled by this small rebellion. -> open_door
* * "Queen to rook two, checkmate!"[] I call, then laugh viciously, as if I am damning him straight to hell.
			 	~ hooperClueType = CHESS
- - (only_catch) I only catch Hooper's reaction for a moment — his eyebrow lifts in surprise and alarm. Good. If he thinks it is a threat then he just might be careless enough to go looking for what it might mean.
* -> END
* *     {!(BedState ? made_up)} [ Remake the bed ]
  Carefully, I pulled the bedsheets back into place, trying to make it seem undisturbed.
  ~ BedState = made_up
+ + {Bed || Sofa} [Comfy]
+ + \ {Bed | Sofa} [ Comfy ]
+ + \ {IsBed()} [ Comfy ]
+ + {IsBed()} [ Comfy ]
