import { _decorator, CCInteger, Component, instantiate, Label, Node, Prefab, Vec3 } from 'cc';
import { BLOCK_SIZE, PlayerController} from './PlayerController';
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
    @property({type: Node})
    public startManu: Node|null = null;//开始的UI
    @property({type: PlayerController})
    public playerCtrl: PlayerController|null = null;//角色控制器
    @property({type: Label})
    public stepLabel: Label|null = null;//分数标签


    start() {
        //设置初始状态
        this.setCurState(GameState.GS_INIT);
        this.playerCtrl?.node.on('jumpEnd',this.onPlayerJumpEnd,this);
    }
        //游戏启动
    init(){
        if (this.startManu){
            this.startManu.active = true;
        }

        this.genetateRoad();

        if(this.playerCtrl){
            this.playerCtrl.setInputActive(false);
            this.playerCtrl.node.setPosition(Vec3.ZERO);
            this.playerCtrl.reset();
        }
    }

    playing(){
        if(this.startManu){
            this.startManu.active = false;
        }
        if(this.stepLabel){
            this.stepLabel.string = "0";
        }
        setTimeout(() => {
            if(this.playerCtrl){
                this.playerCtrl.setInputActive(true);
            }
        }, 0.1);
    }

    end(){

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
                this.playing();
                break;
            case GameState.GS_END:
                this.end();
                break;
        }
    }
    onStartButtonClicked(){
        //点击开始按钮，进入游戏状态
        this.setCurState(GameState.GS_PLAYING);
    }
    onPlayerJumpEnd(moveIndex: number){
        //更新分数显示
        if(this.stepLabel){
            this.stepLabel.string = '' + (moveIndex >= this._road.length ? this._road.length : moveIndex);//更新分数显示
        }
        this.checkResult(moveIndex);//检查结果
    }
    checkResult(moveIndex: number){
        if(moveIndex < this._road.length){
            if(this._road[moveIndex] === BlockType.BT_NONE){
                //如果踩到了空地块，游戏结束
                this.setCurState(GameState.GS_INIT);
            }
        }else{
                this.setCurState(GameState.GS_INIT);//如果超过了路的长度，也算游戏结束
        }
    }
}


