---
title: "Zomboban"
image: "./zomboban.png"
sortOrder: 1
---

![Zomboban](./zomboban.png)

A game inspired by Chip's Challenge. You control a character that can push blocks around, collect items... Standard fair for a tile-based puzzler, _but with zombies!_ The zombies also interact with the tiles. Though their behavior is predefined, the cumulative effect of their movements can be hard to predict.

<a href="http://24.144.94.185" class="Button h1">Play in your browser</a>

(_Still in development as of April 2025_)

<details>
<summary>Techno-babble</summary>
Written in TypeScript using THREE.js for rendering, Blender for 3D assets. A simple Node.js Express backend facilitates the level editor.

Though the gameplay is 2D, I've implemented it in 3D because I have aspirations to make the gameplay 3D.

At the core is a reactive state manager/ECS that I (unfortunately) wrote from scratch. I didn't think it would get so complicated! It does integrate nicely with the editor backend, though.

More justifiably, I also devised a non-blocking spatially-addressed message passing system to allow entities (e.g. the player and a block) to communicate with each other without being tightly coupled.

</details>

