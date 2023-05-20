# Default value of `asked_before` is False
asked_before = False
while True:
    name = ""
    # Changes the question prompt if this is the first time or if it has been asked before
    if asked_before == False:
        name = input("What is your name?\n")
    else:
        name = input("Sorry. Can you write that again please?\n")
    # Checks for a valid name - i.e. consists of only alphabetic characters
    if name.isalpha():
        print(f"Hello, {name}!")
        asked_before = False
    else:
        asked_before = True
