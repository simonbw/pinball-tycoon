import { HemisphereLight } from "three";
import Playfield from "../../playfield/Playfield";
import Backglass from "../../ui/Backglass";
import Table from "../Table";
import {
  getBallDropPosition,
  getIncline,
  getTableBounds,
} from "./svgTableAttributes";
import { getChildrenFromDoc } from "./svgTableChildren";

export async function makeSVGTable(url: string) {
  const response = await fetch(url);
  const svgText = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");

  const table = new Table(
    getTableBounds(doc),
    getIncline(doc),
    getBallDropPosition(doc)
  );

  // Default light
  const hemisphereLight = new HemisphereLight(0xffffff, 0x555555, 1);
  hemisphereLight.position.set(0, 0, -1);
  table.object3ds.push(hemisphereLight);

  // Backglass
  table.addChild(new Backglass(table));

  // Matching playfield
  table.addChild(new Playfield(table.bounds));

  // Load everything else up
  table.addChildren(...getChildrenFromDoc(doc));

  return table;
}
