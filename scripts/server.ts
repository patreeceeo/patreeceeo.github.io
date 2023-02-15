#!/usr/bin/env -S deno run --allow-read --allow-net --allow-env --allow-write --allow-run

import { render } from "../src/render.ts";
import { start } from '~/server/mod.ts'

render()
start()
