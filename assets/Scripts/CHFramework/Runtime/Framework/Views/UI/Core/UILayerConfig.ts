import { _decorator, Component, Enum } from 'cc';
import { LayerEnum } from './UILayers';
const { ccclass, property } = _decorator;

@ccclass('UILayerConfig')
export class UILayerConfig extends Component {
    @property({ type: Enum(LayerEnum) })
    layer: LayerEnum = LayerEnum.Normal;
}