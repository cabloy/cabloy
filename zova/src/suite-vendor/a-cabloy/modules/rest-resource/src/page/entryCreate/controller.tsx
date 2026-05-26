import { Virtual } from 'zova-core';
import { Controller } from 'zova-module-a-bean';

import { ControllerPageEntry, ControllerPageEntrySchemaParams } from '../entry/controller.jsx';

export const ControllerPageEntryCreateSchemaParams = ControllerPageEntrySchemaParams;

@Controller()
@Virtual()
export class ControllerPageEntryCreate extends ControllerPageEntry {}
