# Minmus

Minmus is a minimal modal text editor.

## Installing

Minmus runs directly on a
[Grove](https://github.com/druidic/grove)—no operating
system required.

To install it, follow these instructions:

1. Ensure you have `node` and `npm` installed.
2. `git clone https://github.com/druidic/minmus`
3. `cd minmus`
4. `./build.sh`

The `build.sh` script will copy the Minmus source code to
your clipboard. Paste it into the `startup` record of a
Grove computer and reboot it.

## Getting Started

It's easy! Just start typing.

If you're writing paragraphs, you'll need to break the line
manually by pressing `enter`. There's no horizontal
scrolling; only the first 60 characters of each line are
shown.

### Command mode

While you're entering text, Minmus is in *edit mode*. To
move the cursor, delete lines, or save, you'll need to go
into *command mode*.

To get there, press the semicolon key (`;`). Then you can
type any of the following command keys:

- **J** and **K** move the cursor up and down
- **L** goes back into edit mode
- **D** deletes the line at the cursor
- **S** saves the file
- **I** inserts a line above the cursor

What if you don't want to go into command mode, but instead
just want to type a semicolon? You can do it by pressing
`;` twice. Additionally, if you type a space or press enter
after pressing the semicolon key, you'll enter a semicolon
followed by a space or new line.
