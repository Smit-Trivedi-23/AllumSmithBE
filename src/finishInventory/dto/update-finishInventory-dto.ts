import { PartialType } from "@nestjs/mapped-types";
import { CreateFinishInventoryDto } from "./create-finishInventory.dto"

export class updateFinishInventoryDto extends PartialType(CreateFinishInventoryDto) { }