* (my_label) { true } A (choice) -> go
* {wait or "torch"} [I'll just wait here a moment] -> wait
* {wait || torch(22, "bob")} {thing > 45.2} [I'll just wait here a moment] after -> wait
*\ {not_condition || to_condition} #tag
