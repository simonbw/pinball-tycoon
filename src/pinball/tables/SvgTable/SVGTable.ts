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
import { fetchSVGDoc } from "./svgUtils";
import Cabinet from "../../environment/Cabinet";
import GeneralIllumination from "../../environment/GeneralIllumination";

export async function makeSVGTable(url: string) {
  const doc = await fetchSVGDoc(url);

  const table = new Table(
    getTableBounds(doc),
    getIncline(doc),
    getBallDropPosition(doc)
  );

  table.addChild(new GeneralIllumination());

  // Cabinet
  table.addChild(new Cabinet(table, 6, 4));

  // Backglass
  table.addChild(new Backglass(table, 6 + 4));

  // Playfield
  table.addChild(new Playfield(table.bounds));

  // Load everything else up
  console.time("getChildren");
  table.addChildren(...getChildrenFromDoc(doc));
  console.timeEnd("getChildren");

  return table;
}
