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
import { fetchText } from "./svgUtils";

export async function makeSVGTable(url: string) {
  const svgText = await fetchText(url);
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");

  const table = new Table(
    getTableBounds(doc),
    getIncline(doc),
    getBallDropPosition(doc)
  );

  // Default light
  const hemisphereLight = new HemisphereLight(0xffffff, 0x333333, 1);
  hemisphereLight.position.set(0, 0, -2);
  table.object3ds.push(hemisphereLight);

  // Backglass
  table.addChild(new Backglass(table));

  // Matching playfield
  // TODO: Determine material
  table.addChild(new Playfield(table.bounds));

  // Load everything else up
  table.addChildren(...getChildrenFromDoc(doc));

  return table;
}
