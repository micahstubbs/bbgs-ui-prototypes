This example shows how to combine [d3-drag](https://github.com/d3/d3-drag) and [d3-zoom](https://github.com/d3/d3-zoom) to allow dragging of individual circles within a zoomable canvas. If you click and drag on the background, the view pans; if you click and drag on a circle, it moves.

The tricky part of this example is the need to distinguish between two coordinate spaces: the world coordinates used to position the circles, and the pointer coordinates representing the mouse or touches. The drag behavior doesn’t know the view is being transformed by the zoom behavior, so you must convert between the two coordinate spaces.

Compare this to the [simpler SVG implementation](/mbostock/3127661b6f13f9316be745e77fdfb084).
