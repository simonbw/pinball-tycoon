import FilterList from "./util/FilterList";
import Entity from "./entity/Entity";
import ListMap from "./util/ListMap";
import { CustomHandlersMap } from "./entity/GameEventHandler";

/**
 * Keeps track of entities. Has lots of useful indexes.
 */
export default class EntityList implements Iterable<Entity> {
  all = new Set<Entity>();

  filtered = {
    afterPhysics: new FilterList<Entity>((e) => Boolean(e.afterPhysics)),
    beforeTick: new FilterList<Entity>((e) => Boolean(e.beforeTick)),
    onRender: new FilterList<Entity>((e) => Boolean(e.onRender)),
    onTick: new FilterList<Entity>((e) => Boolean(e.onTick)),
    onPause: new FilterList<Entity>((e) => Boolean(e.onPause)),
    onUnpause: new FilterList<Entity>((e) => Boolean(e.onUnpause)),
    hasSprite: new FilterList<Entity>((e) => Boolean(e.sprite)),
    hasBody: new FilterList<Entity>((e) => Boolean(e.body)),
  };

  private tagged = new ListMap<string, Entity>();
  private handlers = new ListMap<string, Entity>();

  add(entity: Entity) {
    this.all.add(entity);
    for (const list of Object.values(this.filtered)) {
      list.addIfValid(entity);
    }

    if (entity.tags) {
      for (const tag of entity.tags) {
        this.tagged.add(tag, entity);
      }
    }

    if (entity.handlers) {
      for (const handler of Object.keys(entity.handlers)) {
        this.handlers.add(handler, entity);
      }
    }
  }

  remove(entity: Entity) {
    this.all.delete(entity);
    for (const list of Object.values(this.filtered)) {
      list.remove(entity);
    }

    if (entity.tags) {
      for (const tag of entity.tags) {
        this.tagged.remove(tag, entity);
      }
    }

    if (entity.handlers) {
      for (const handler of Object.keys(entity.handlers)) {
        this.handlers.remove(handler, entity);
      }
    }
  }

  getTagged(key: string): ReadonlyArray<Entity> {
    return this.tagged.get(key);
  }

  getHandlers(eventType: string): ReadonlyArray<Entity> {
    return this.handlers.get(eventType);
  }

  [Symbol.iterator]() {
    return this.all[Symbol.iterator]();
  }
}
