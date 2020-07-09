import { Container, Graphics } from "pixi.js";
import BaseEntity from "../../core/entity/BaseEntity";
import Entity, { WithOwner } from "../../core/entity/Entity";
import { degToRad, polarToVec } from "../../core/util/MathUtil";
import { rNormal, rUniform } from "../../core/util/Random";
import { Vector } from "../../core/Vector";
import { Body, World, SAPBroadphase, AABB } from "p2";
import Wall from "../playfield/Wall";
import Light from "../lighting/Light";

export interface ParticleSystemParams {
  position: Vector;
  count?: number;
  color?: number;
  size?: number;
  grow?: number;
  friction?: number;
  swirlFriction?: number;
  lifespan?: number;
  destroyOnCollision?: boolean;
  getSize?: () => number;
  getColor?: () => number;
  getDirection?: () => number;
  getSpeed?: () => number;
  getLife?: () => number;
  getSwirl?: () => number;
  getLight?: () => Light;
  lifeToAlpha?: (life: number) => number;
}

export default class ParticleSystem extends BaseEntity implements Entity {
  sprite = new Container();
  particles: Particle[] = [];

  constructor({
    count = 20,
    position,
    size,
    color,
    getSize,
    getColor,
    getDirection,
    getSpeed,
    getLife,
    getSwirl,
    getLight,
    ...rest
  }: ParticleSystemParams) {
    super();

    this.particles = [];
    for (let i = 0; i < count; i++) {
      const theta = getDirection?.() ?? rUniform(-Math.PI, Math.PI);
      const speed = getSpeed?.() ?? 1.0;
      const velocity = polarToVec(theta, speed);
      const particlePosition: Vector = velocity.mul(1.0 / 60.0);

      const particle = new Particle({
        position: particlePosition,
        velocity: velocity,
        life: getLife?.() ?? 1.0,
        swirl: getSwirl?.() ?? 0,
        light: getLight?.(),
        size: getSize?.() ?? size,
        color: getColor?.() ?? color,
        ...rest,
      });

      this.particles.push(particle);
    }
    // Sort for faster removal later
    this.particles.sort((a, b) => b.life - a.life);
    for (const particle of this.particles) {
      this.addChild(particle);
      this.sprite.addChild(particle.pSprite);
    }

    this.sprite.position.set(...position);
  }

  onRender() {
    if (!this.children?.length) {
      this.destroy();
    }
  }
}

interface ParticleOptions {
  position?: Vector;
  velocity?: Vector;
  friction?: number;
  life?: number;
  color?: number;
  lifespan?: number;
  swirl?: number;
  swirlFriction?: number;
  destroyOnCollision?: boolean;
  size?: number;
  grow?: number;
  light?: Light;
  lifeToAlpha?: (life: number) => number;
}

class Particle extends BaseEntity implements Entity {
  pSprite = new Graphics();
  position: Vector;
  velocity: Vector;
  friction: number;
  life: number;
  lifespan: number;
  swirl: number;
  swirlFriction: number;
  destroyOnCollision: boolean;
  light?: Light;
  lifeToAlpha?: (life: number) => number;
  grow: number;

  constructor({
    position = [0, 0],
    velocity = [0, 0],
    friction = 0.0,
    life = 1.0,
    color = 0xffffff,
    lifespan = 1.0,
    swirl = 0,
    swirlFriction = 0.1,
    destroyOnCollision = false,
    size = 0.2,
    grow = 0.0,
    light,
    lifeToAlpha = (a) => a,
  }: ParticleOptions) {
    super();
    this.position = position;
    this.velocity = velocity;
    this.friction = friction;
    this.life = life;
    this.lifespan = lifespan;
    this.swirl = swirl;
    this.swirlFriction = swirlFriction;
    this.destroyOnCollision = destroyOnCollision;
    this.light = light;
    this.lifeToAlpha = lifeToAlpha;
    this.grow = grow;

    this.pSprite.beginFill(color);
    this.pSprite.drawCircle(0, 0, size);
    this.pSprite.endFill();

    if (light) {
      this.addChild(light);
    }
  }

  onTick(dt: number) {
    this.life -= dt / this.lifespan;
    if (this.life <= 0) {
      this.destroy();
    } else if (this.checkCollisions()) {
      this.destroy();
      return;
    } else {
      this.swirl *= 1.0 - this.swirlFriction * dt;
      this.velocity.angle += this.swirl * dt;
      this.velocity.imul(1.0 - this.friction * dt);
      this.position.iadd(this.velocity.mul(dt));
      this.pSprite.scale.set(this.pSprite.scale.x * (1.0 + this.grow * dt));
    }
  }
  onRender() {
    if (this.light) {
      this.light.lightData.position[0] = this.position[0];
      this.light.lightData.position[1] = this.position[1];
    }
    this.pSprite.position.set(...this.position);
    this.pSprite.alpha = this.lifeToAlpha?.(this.life) ?? this.life;
  }

  private checkCollisions(): boolean {
    if (!this.destroyOnCollision) {
      return false;
    }
    const world = this.game!.world;
    const broadphase = world.broadphase as SAPBroadphase;
    const bodies = broadphase
      .aabbQuery(
        world,
        new AABB({ upperBound: this.position, lowerBound: this.position })
      )
      .filter((body) => (body as WithOwner).owner instanceof Wall);
    return this.game!.world.hitTest(this.position, bodies, 0).length > 0;
  }
}
