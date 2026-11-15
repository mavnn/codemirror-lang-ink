{
- wait:
    What's that?! #emote fear #animation shake

    Oh. Phew. It's just Moget the cat.

- else:
    Moget, you clumsy cat! What a mess! #emote rage  #animation shake
}
{ firstBlock:
    Some stuff here
    -> other_place
- else:
  Blah
}
Hello
{
- firstBlock:
    Some stuff here
    -> other_place
- else: Blah
}
{
// Check the enemy isn't dead before having them attack.
- enemy_health <= dead:
  ->->
}
{ bedroomLightState ? on:
    <> The bulb fell dark.
    ~ bedroomLightState += off
    ~ bedroomLightState -= on
- else:
    { bedroomLightState ? on_floor: <> A little light spilled under the bed.} { bedroomLightState ? on_desk : <> The light gleamed on the polished tabletop. }
    ~ bedroomLightState -= off
    ~ bedroomLightState += on
}
