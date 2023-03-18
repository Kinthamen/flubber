# flubber

A different [Svelte](https://svelte.dev/) take on node diagramming inspired by [Reactflow](https://reactflow.dev/) and [Svelvet](https://www.svelvet.io/).

These two projects are amazing and you should definitely check them out as they are more mature and feature rich. Full credit goes to them on some of the design, structure, and code that is used in flubber.

## Why make flubber

`reduce typescript to manageable and understandable levels`

Honestly, I have a love and hate relationship with Typescript and both of those projects have what I consider an unhealthy amount of it. I tried to contribute to them, but spent most of my time trying to figure out where things came from and what the models should look like. Seriously, how many `Something<T>` and `extends` do you need? Just because it looks fancy doesn't mean it's readable! Might as well be monkey patching.

`improve store management`

[Reactflow](https://reactflow.dev/) did itself a favor in switching to [zustand](https://github.com/pmndrs/zustand). I love it! But Svelte's builtin store is easier to digest IMHO. Especially with `$someStore` subscription. Don't even get me started on how amazing custom stores are! [Svelvet](https://www.svelvet.io/) is using all of this but, IMO, the stores feel clunky. When I look around the code, there's all kinds of unnecessary imports happening.

`footprint`

Holy mole(y)! Both of these have so much code to do a simple thing. Granted, it's a [react](https://react.dev/) thing for Reactflow. Svelte is a lot better, but that's because of how easy it is to use Svelte. Kuddos to Svelte!

## The Goal

The goal is to reduce the 'Why' through constant refactoring. It's not to compete against Reactflow or Svelvet, but more of a study on how to simplify seemly complex things. If either of those projects notice something in flubber that can be used by them, flubber is glad to be of use.

## What can flubber do?

The basics:

1. Create custom Nodes/Edges using `.svelte` files
2. Connect `connectors` between nodes
3. Customize the graph size, background style ('dots' or 'lines') and spacing
4. Style flubber with a simple style tag (more of a flex way, so you don't need hard height/width values)

## Developing

Install dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of the library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build the library:

```bash
npm run package
```

To create a production version of the showcase app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy the app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
