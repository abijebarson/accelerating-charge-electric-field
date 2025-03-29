# Electric Field of an Accelerating Charge (on a single plane)

Inspired by: [This 3blue1brown video](https://www.youtube.com/watch?v=aXRTczANuIs)

I'll add more info about the working later.

## Running

1. You need node.js to run this. Install it from their site. It's one google search away.
2. I used vite to host the applet to a local server and run it from the browser. You can npm install it globally if you really like it with
`npm install vite -g` (optional).
3. `npm install` from the root of this cloned repo to install necessary modules.
4. Host using `npx vite` and open the hosted ip with your browser.

## Packages used

I'm adding this section because, two of these packages I built on my machine and the original repo might behave differently. But you can build them yourself too with necessary changes of your wish.

1. [mrdoob/three.js](https://github.com/mrdoob/three.js) - A JavaScript 3D library
2. [desmosinc/mathquill](https://github.com/desmosinc/mathquill) - A web formula editor designed to make typing math easy and beautiful. This is forked from [mathquill/mathquill](https://github.com/mathquill/mathquill).
3. [thatcomputerguy0101/tex-math-parser](https://github.com/thatcomputerguy0101/tex-math-parser/tree/main) forked from [davidtranhq/tex-math-parser](https://github.com/davidtranhq/tex-math-parser)- To parse the tex output from mathquill to math.js expression tree which makes it evaluatable. Modified a little myself and might modify more in the future. 