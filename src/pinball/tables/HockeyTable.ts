import hockeyTable from "../../../resources/tables/hockey-table.svg";
import { keyCodeToName } from "../../core/io/Keys";
import { getBinding } from "../ui/KeyboardBindings";
import TextOverlay from "../ui/TextOverlay";
import { Rect } from "../util/Rect";
import { makeSVGTable } from "./SvgTable/SVGTable";
import ObjectivesSystem from "../system/ObjectivesSystem";

export async function makeHockeyTable() {
  const table = await makeSVGTable(hockeyTable);

  const leftKeyName = keyCodeToName(getBinding("LEFT_FLIPPER"));
  const rightKeyName = keyCodeToName(getBinding("RIGHT_FLIPPER"));
  table.addChildren(
    new TextOverlay(
      `${leftKeyName}`,
      Rect.fromTopLeft([-23, 96], 5, 3),
      -3,
      "left"
    ),
    new TextOverlay(
      `${rightKeyName}`,
      Rect.fromBottomRight([23, 99], 5, 4),
      -3,
      "right"
    )
  );

  table.addChild(new ObjectivesSystem());

  return table;
}
