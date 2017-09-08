## Features
* Uses ES6 class
  * Non-trivial example.
    * Has structure, not one gigantic function.
* Dynamic add/remove of nodes/links
  * Left-click to add a node
  * Right-click to remove a node
  * Remember to use key functions!!! :sweat_smile:
* Pan/Zoom on a background `rect`
  * Drag/zoom the background
  * Allows for background (click) events
* Groups instead of direct circles
  * Most examples have a `circle` element directly on the svg
  * This example has a group with circles and labels
  * Common functionality goes on the group, e.g. click, drag, etc.
  * Also shows merging of `enter` data join