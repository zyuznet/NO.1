import { _decorator, CCInteger, Component, instantiate, Node, Prefab } from 'cc';
import { BLOCK_SIZE } from './PlayerController';
const { ccclass, property } = _decorator;

enum BlockType {
    BT_NONE,
    BT_STONE,
};
enum GameState {
    GS_INIT,
    GS_PLAYING,
    GS_END,
};

@ccclass('GameManager')
export class GameManager extends Component {
    @property({type: Prefab})
    public boxPrefab: Prefab|null = null;
    @property({type: CCInteger})
    public roadLength: number = 50;
    private _road: BlockType[] = [];

    start() {
        //设置初始状态
        this.setCurState(GameState.GS_INIT);
    }
        //游戏启动
    init(){
        this.genetateRoad();
    }

    update(deltaTime: number) {
        
    }
    genetateRoad(){
        //清空旧路
        this.node.removeAllChildren();
        //重置路
        this._road = [];
        this._road.push(BlockType.BT_STONE);//起点
        //生成路
        for (let i = 1; i < this.roadLength; i++) {
            //如果前一个是空地块，则当前地块必定是石块
            if(this._road[i-1] === BlockType.BT_NONE){
                this._road.push(BlockType.BT_STONE);
            }else{
                this._road.push(Math.floor(Math.random() * 2)); // 0 or 1
            }
        }

        //实例化路
        for (let j = 0; j < this._road.length; j++) {
            let block: Node | null = this.spawnBlockByType(this._road[j]);
            if(block){
                this.node.addChild(block);
                block.setPosition(j * BLOCK_SIZE, 0, 0);
            }
        }
        
    }
    spawnBlockByType(type: BlockType)  : Node | null {
        //根据类型实例化地块
        if(!this.boxPrefab){
            return null;
        }
        let block: Node | null = null;
        switch(type){
            case BlockType.BT_STONE:
                block = instantiate(this.boxPrefab);
                break;
        }
        return block;
    }
    //设置当前游戏状态
    setCurState(value: GameState){
        switch(value){
            case GameState.GS_INIT:
                //调用游戏启动
                this.init();
                break;
            case GameState.GS_PLAYING:
                break;
            case GameState.GS_END:
                break;
        }
    }

}


