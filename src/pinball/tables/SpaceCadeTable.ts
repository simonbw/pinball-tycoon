import spaceCadetTable from "../../../resources/tables/space-cadet-table.svg";
import { keyCodeToName } from "../../core/io/Keys";
import { TEXTURES } from "../graphics/textures";
import Playfield from "../playfield/Playfield";
import ObjectivesSystem from "../system/ObjectivesSystem";
import { getBinding } from "../ui/KeyboardBindings";
import TextOverlay from "../ui/TextOverlay";
import { Rect } from "../util/Rect";
import SVGTable from "./SvgTable/SVGTable";
import { fetchSVGDoc } from "./SvgTable/svgUtils";
import SpaceCadetObjectivesSystem from "../system/SpaceCadetObjectivesSystem";

export async function loadSpaceCadetDoc() {
  return fetchSVGDoc(spaceCadetTable);
}

export default class SpaceCadetTable extends SVGTable {
  constructor(doc: Document) {
    super(doc);

    const playfield = this.children.find(
      (child) => child.id === "playfield"
    ) as Playfield;
    playfield.onEmissive = 0x221122;
    playfield.material.color.set(0x330066);

    this.addChild(new SpaceCadetObjectivesSystem());
    this.addChildren(...makeLabels());
  }
}

function makeLabels(): TextOverlay[] {
  const leftKeyName = keyCodeToName(getBinding("LEFT_FLIPPER"));
  const rightKeyName = keyCodeToName(getBinding("RIGHT_FLIPPER"));
  const leftNudgeKeyName = keyCodeToName(getBinding("NUDGE_UP_RIGHT"));
  const rightNudgeKeyName = keyCodeToName(getBinding("NUDGE_UP_LEFT"));

  return [
    new TextOverlay(
      `${leftKeyName}`,
      Rect.fromBottomLeft([-23, 99], 5, 2),
      -3,
      "left"
    ),
    new TextOverlay(
      `${leftNudgeKeyName}`,
      Rect.fromBottomLeft([-23, 97], 5, 2),
      -3,
      "left"
    ),
    new TextOverlay(
      `${rightKeyName}`,
      Rect.fromBottomRight([23, 99], 5, 2),
      -3,
      "right"
    ),
    new TextOverlay(
      `${rightNudgeKeyName}`,
      Rect.fromBottomRight([23, 97], 5, 2),
      -3,
      "right"
    ),
  ];
}
