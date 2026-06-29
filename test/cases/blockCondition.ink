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
