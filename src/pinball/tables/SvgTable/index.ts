import { parse as parseSvgText } from "svg-parser";
import { HemisphereLight } from "three";
import Playfield from "../../playfield/Playfield";
import Table from "../Table";
import {
  getBallDropPosition,
  getIncline,
  getTableBounds,
} from "./svgTableAttributes";
import { getChildrenFromHast } from "./svgTableChildren";
import { cleanupTree, fetchText } from "./svgUtils";
import Backglass from "../../ui/Backglass";

export async function makeSVGTable(url: string) {
  const svgText = await fetchText(url);
  const hastTree = cleanupTree(parseSvgText(svgText));

  const table = new Table(
    getTableBounds(hastTree),
    getIncline(hastTree),
    getBallDropPosition(hastTree)
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
  table.addChildren(...getChildrenFromHast(hastTree));

  return table;
}
