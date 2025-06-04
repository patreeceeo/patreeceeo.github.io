---
title: ""
pubDate: 2025-06-03
---

# Spatial Message Passing: A Communication System for Grid-Based Games

## Introduction

Game entities need to communicate – when a player pushes a block, when a monster attacks, when a button is pressed.
Most game engines solve this with global event systems or direct entity references. But what if entities could send
messages based on their spatial location, just like shouting across a room?

This article explores a spatial message-passing system implemented in [Zomboban](/#zomboban), a Sokoban-style puzzle game, that
enables entities to communicate based on their tile positions rather than direct references.

## Overview: Spatial Communication in Games

Traditional game communication patterns include:
- Global Events: EventBus.emit('player-died')
- Direct References: player.takeDamage(monster.attackPower)

Each has trade-offs. Global events lack spatial context. Direct references create tight coupling.

Spatial messaging offers a middle ground: entities send typed messages to specific locations, and any entity at that
 location can respond. This mirrors real-world physics – effects propagate through space, not arbitrary connections.

## Implementation Architecture

The system consists of three core components:

1. Messages (src/Message.ts:31-48)

```typescript
export abstract class Message<Answer> {
  constructor(
    readonly sender: ITileActor,
    readonly id = Message.getNextId()
  ) {}
  response?: Answer;
  get type() {
    return (this.constructor as IMessageConstructor<any>).type;
  }
}
```

Messages are typed requests with expected response types. For example, `MoveMessage.Into` expects a `Response.Allowed`
or `Response.Blocked` answer.

2. Spatial Delivery (src/Message.ts:57-80)

```typescript
export function sendMessage<PResponse>(
  msg: Message<PResponse>,
  tilePosition: Vector3,
  context: BehaviorState & ITilesState
): Iterable<PResponse | undefined> {
  const receivers = getReceivers(context.tiles, tilePosition);

  for (const receiver of receivers) {
    const behavior = context.getBehavior(receiver.behaviorId);
    const response = behavior.onReceive(msg, receiver, context);
    receiver.inbox.add(msg);
    sender.outbox.add(msg);
  }
}
```

Messages are delivered to all entities at a specific tile coordinate. The TileMatrix efficiently finds entities by
position.

3. Behavior Handlers (src/systems/BehaviorSystem.ts:56-65)

```typescript
onReceive<PResponse>(
  message: Message<PResponse>,
  entity: Entity,
  context: Context
): PResponse | undefined {
  const { messageHandlers } = this;
  if (message.type in messageHandlers) {
    return messageHandlers[message.type](entity, context, message);
  }
}
```

Each entity behavior defines handlers for message types it cares about, using a strategy pattern.

### Example: Block Movement

When a player pushes a block, here's the message flow:

1. Player sends `MoveMessage.Into` to the tile they want to move into. They use a helper function to reduce the responses to a single yes or no, since there can be multiple entities there. If they are allowed, then they queue a move action. (src/behaviors/PlayerBehavior.ts:72-83):

```typescript
const responses = sendMessage(
  new MoveMessage.Into(entity),
  _nextTilePosition,
  context
);
const response = MoveMessage.reduceResponses(responses);
if (response === MoveMessage.Response.Allowed) {
  actions.push(new MoveAction(entity, context.time, _tileDelta));
}
```

2. Block receives their message and sends a special move message to the player's tile position (src/behaviors/BlockBehavior.ts:99-133):

```typescript
    [MoveMessage.Into.type]: (
      entity: Entity,
      context: BehaviorContext,
      message: Message<any>
    ): MessageAnswer<MoveMessage.Into> => {
        const { sender } = message;
        ...
          sendMessage(
            new MoveMessage.IntoBlock(entity),
            sender.tilePosition,
            context
          )
        ...
    }
```

3. When the player receives the special move message, they respond that they are allowed to move into blocks (src/behaviors/PlayerBehavior.ts:119):

```typescript
[MoveMessage.IntoBlock.type]: () => MoveMessage.Response.Allowed,
```

4. Which the block receives, and since the player says they're allowed to move, we continue
by checking if the block can move into the tile in the direction it's being pushed. If the block is blocked, then the player is blocked. (src/behaviors/BlockBehavior.ts:99-133 again):

```typescript
      const { sender } = message;

      const response = MoveMessage.reduceResponses(
        sendMessage(
          new MoveMessage.IntoBlock(entity),
          sender.tilePosition,
          context
        )
      )

      if (
        response === MoveMessage.Response.Blocked
      ) {
        return MoveMessage.Response.Blocked;
      }

      const senderPosition = sender.tilePosition;
      const receiverPosition = entity.tilePosition;
      const nextTilePosition = this.computeNextTilePosition(
        senderPosition,
        receiverPosition,
        _tempVector
      );

      return MoveMessage.reduceResponses(
        sendMessage(new MoveMessage.Into(entity), nextTilePosition, context)
      );
```

Note that the chain of messages when determining if the player can move can extend beyond just one other entity, but can be arbitrarily long. This comes in handy when there's blocks that can be bunched up in a row, and the player tries to push from one end.

### Benefits & Trade-offs

Benefits:
- Spatial locality: Only relevant entities receive messages
- Type safety: Compile-time checking of message/response pairs
- Decoupling: Entities don't need direct references to each other
- Emergent behavior: Complex interactions from simple rules

Trade-offs:
- Grid limitation: Only works for tile-based games
- Performance: Message creation/delivery overhead
- Debugging: Message flows can be hard to trace

## The Double Dispatch Pattern: Specialized Message Types

Looking at the message types in src/messages.ts, you'll notice an interesting pattern:

```typescript
export class Into extends Message<Response> {
  static type = "MoveInto";
}
```

```typescript
export class IntoWall extends Message<Response> {
  static type = "MoveIntoWall";
}
```

```typescript
export class IntoBlock extends Message<Response> {
  static type = "MoveIntoBlock";
}
```

```typescript
export class IntoPlayer extends Message<Response> {
  static type = "MoveIntoPlayer";
}
```

Why have both `MoveMessage.Into` and specialized variants like `MoveMessage.IntoWall`? This implements the double
dispatch pattern – a technique for handling interactions between different types of objects.

### The Problem: Type-Specific Behavior

Consider what happens when a player moves into different entities:
- Moving into a wall: Always blocked
- Moving into a block: Block should try to move, player moves if successful
- Moving into a fire: Player dies and level restarts
- Moving into a monster: Player dies and level restarts

Each combination of "mover type" + "target type" requires different logic. Without double dispatch, you'd need ugly
conditional chains:

```typescript
// BAD: Manual type checking
if (target instanceof Wall) {
  return Response.Blocked;
} else if (target instanceof Block && mover instanceof Player) {
  // Try to push block...
} else if (target instanceof Fire) {
  // Kill the mover...
}
```

### The Solution: Double Dispatch

Instead, the system uses a two-step dispatch:

Step 1: Generic message (src/behaviors/PlayerBehavior.ts:72-76)

```typescript
const responses = sendMessage(
  new MoveMessage.Into(entity),  // Generic "something wants to move here"
  _nextTilePosition,
  context
);
```

Step 2: Specific message (src/behaviors/BlockBehavior.ts:99-133)

```typescript
[MoveMessage.Into.type]: (entity: Entity, context: BehaviorContext, message: Message<any>) => {
  // Block received generic "Into" message, now sends specific "IntoBlock" message
  return MoveMessage.reduceResponses(
    sendMessage(
      new MoveMessage.IntoBlock(entity),  // "A block is being pushed"
      message.sender.tilePosition,
      context
    )
  );
}
```

Step 3: Type-specific handling (src/behaviors/PlayerBehavior.ts:98-109)

```typescript
[MoveMessage.IntoBlock.type]: () => MoveMessage.Response.Blocked,
[MoveMessage.IntoWall.type]: () => MoveMessage.Response.Blocked,
[MoveMessage.IntoFire.type]: (_: Entity, context: BehaviorContext) => {
  handleRestart(context);  // Player dies
}
```

### Why This Works

1. First dispatch: Based on the target's type (what entity receives the message)
2. Second dispatch: Based on the sender's type (what specific message gets sent back)

This allows each entity type to:
- Define how it responds to being moved into
- Define how it responds to moving into other specific types

For example, a Monster might:
- Send MoveMessage.IntoPlayer when moving into a player (to kill them)
- Handle MoveMessage.IntoMonster by blocking movement (monsters can't stack)
- Handle MoveMessage.IntoWall by blocking movement

### Benefits of Double Dispatch

Type Safety: Each message type has a clear semantic meaning

```typescript
// Clear intent: "A monster is attacking"
new MoveMessage.IntoMonster(monster)
```

```typescript
// vs unclear: "Something is moving"
new MoveMessage.Into(monster)
```

Extensibility: Adding new entity types only requires:
1. A new message type (MoveMessage.IntoNewThing)
2. Handlers for that message type in relevant behaviors

Clean Separation: Each entity defines its own interaction rules without knowing about every other entity type.

Emergent Complexity: Complex interactions emerge from simple, local rules rather than centralized interaction
matrices.

### Real-World Example

When a player pushes a block toward a wall:

1. Player sends MoveMessage.Into to target position
2. Block receives it, sends MoveMessage.IntoBlock back to player position
3. Player responds to MoveMessage.IntoBlock by claiming they can move into blocks (which is sorta true)
4. Block sends MoveMessage.Into to its target position (wall)
5. Wall receives it, sends MoveMessage.IntoWall back to block position
6. Block handles MoveMessage.IntoWall by returning Response.Blocked
7. Player receives Response.Blocked and doesn't move

This chain of double dispatches creates the correct "push a block against a wall" behavior without any entity
needing to know about the others' implementation details.

The double dispatch pattern transforms what could be a complex interaction matrix into a series of simple, local
decisions that compose into sophisticated gameplay.

Of course, sometimes this pattern is overkill and a simple conditional is sufficient. This system doesn't require double dispatch for every interaction, but it shines when you have multiple entity types that need to interact in complex ways, in which case you probably do want double dispatch.

## Future Applications

This system could be adapted for:

Grid-based games:
- Turn-based strategy games
- Roguelikes
- Tower defense games
- Puzzle games

Non-grid applications:
- Cellular automata: Cells communicate with neighbors
- Distributed systems: Services communicate by location/region
- IoT networks: Devices broadcast to spatial zones
- Social networks: Location-based messaging

### Adaptation Guidelines

To reuse this system:

1. Define your spatial model: Grid tiles, geographic regions, network zones
2. Create message types: What information needs to flow between entities?
3. Implement spatial lookup: Efficiently find entities by location
4. Design response aggregation: How do multiple responses combine?

## Conclusion

Spatial message passing offers an elegant middle ground between global events and direct coupling. By constraining
communication to spatial relationships, it creates more believable, emergent gameplay while maintaining clean code
architecture.

The system works particularly well for games where spatial relationships matter – which is most games. While it
requires careful design of message types and spatial models, the result is a communication system that feels natural
 and scales well with game complexity.

For developers building tile-based games or any application where spatial relationships drive behavior, this system
 offers a proven, type-safe approach to entity communication that's both performant and maintainable.

---
This system is implemented in https://github.com/patreeceeo/zomboban, an open-source puzzle game built with
TypeScript and Three.js.
