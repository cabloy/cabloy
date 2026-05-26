import { Virtual } from 'zova';
import { Bean } from 'zova-module-a-bean';

import { BeanModelFirst } from './bean.model/bean.model.first.js';

@Bean()
@Virtual()
export class BeanModelBase extends BeanModelFirst {}
