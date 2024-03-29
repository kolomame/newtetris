
document.addEventListener('DOMContentLoaded', function() {
    //HTMLのスコア表示のため↓
    const scoreDisplay = document.querySelector('#score')
  
    const speed = 5000;
    var point = 0;
    function tetrimino(num){
  
        const tetoriminos = [
            [[0,1,1,0],
            [0,1,1,0],
            [0,0,0,0],
            [0,0,0,0]],
  
            [[0,1,0,0],
            [0,1,1,0],
            [0,0,1,0],
            [0,0,0,0]],
            
            [[0,0,1,0],
            [0,1,1,1],
            [0,0,0,0],
            [0,0,0,0]],
  
            [[0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0]],
  
            [[0,1,1,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,0,0,0]]]
            //[1, 3],   [1, 2],  [1, 1],   [2, 1]   回転前
            //x:-1,y:-2 x:0,y:-1 x:+1,y:0  x:0,y:+1
            //[[0, 1],  [1, 1],  [2, 1],   [2, 2]]　回転前の座標が回転することによりどこに移ったか（xとyの変化量をそれぞれ記憶する）
  
        return tetoriminos[num]
  
    }
    const red = '#ff0000'
    const gray = '#CCCCCC' 
    const green = '#008000'
    const yellow = '#ffff00'
    const purple = '#800080'
    const blue = '#0000ff'
    const black = '#000000'
    const color = [green, red, purple, blue, yellow, black] 
  
  
  
    let copyField = Array(20).fill().map(() => Array(10).fill(0));
    
    let field = Array(20).fill().map(() => Array(10).fill(0));
    const width = 10;//fieldの横の長さ
    const height = 20;
  
    //横一列揃ったら一列消える
    function disapper(field, point){
        for (var i = 0; i < height; i++){
            if (field[i].indexOf(0) == -1){
                field[i].fill(0)
                //scoreを保存する
                point = score(point)
                console.log(point)
                //消えた分下に下がる
                down(i, field)
                // console.log(field)
  
            }
        }
        return point
    }
  
    //上の段のものが一つ下に落ちる
    function down(i,field){
        for (var j = i; j > 0; j--){
            for (var k = 0; k < width; k++){
                field[j][k] = field[j-1][k]
            }
        }
        field[0].fill(0)  //0 or i
    }
  
    //指定された座標が1or0
    //衝突判定
    //衝突したらTrue
    function judge(x, y, field){
  
        return field[y][x] != 0 //&& field[y][x] != 7
    }
    //positionはfield上
    const twidht=4
    const theight=4
    function getxy(tetorimino){
        position = []
        for (let y = 0; y < twidht; y++){
            for (let x = 0; x < theight; x++){
                if (tetorimino[y][x] == 1){
                    position.push([x+3, y])
                }
            }  
        }
        return position
    }
  
    //fieldに反映させる（固定）
    function updateField(field, position){
        for (let i = 0; i < position.length; i++){
            let x = position[i][0]
            let y = position[i][1]
            field[y][x] = 1
        }
        return field
    }
  
  
    //下にブロックがあるか判定
    //ブロックがあるtrue
    function underjudge(field, position){
        for(let i = 0; i < position.length; i++){
            //下にブロックがあったら
            if (position[i][1] === 19 || judge(position[i][0], position[i][1]+1, field)){
                return true
            }
        }
        return false
    }
  
  
    //下に落ちる
    function under(field, position, copyField){
        console.log('field: ',field)
        console.log('position: ', position)
  
        //position更新
        newPosition = []
        for (let j = 0; j < position.length; j++){
            copyField[position[j][1]][position[j][0]] = 1
            newPosition.push([position[j][0],position[j][1]+1])
        }
        console.log('newposition', newPosition)
        return newPosition
    }
    //右に移動
    function right(position){
        // console.log(field)
        // console.log(copyField)
        for (let i = 0; i < position.length; i++){
            let x = position[i][0]
            let y = position[i][1]
            if (x == 9 || judge(x+1, y, field)){
                return position
            }
        }
        newPosition = []
        for (let j = 0; j < position.length; j++){
            let x = position[j][0]
            let y = position[j][1]
            newPosition.push([x+1, y])
        }
        return newPosition
    }
  
    //左に移動
    function left(position){  
        for (let i = 0; i < position.length; i++){
            let x = position[i][0]
            let y = position[i][1]
            if (x == 0 || judge(x-1, y, field)){
                return position
            }
        }
        newPosition = []
        for (let j = 0; j < position.length; j++){
            let x = position[j][0]
            let y = position[j][1]
            newPosition.push([x-1, y])
        }
    
        return newPosition
    }
  
    //回転
    function rotate(position){
  
        newPosition = []
        let centerx = 0
        let centery = 0
        for (let i = 0; i < position.length; i++){
            centerx += position[i][0]
            centery += position[i][1]
        }
    
        for (let j = 0; j < position.length; j++){
            let x = position[j][0]-(centerx/4)
            let y = position[j][1]-(centery/4)
            let X = Math.ceil(x*Math.cos(Math.PI/2) - y*Math.sin(Math.PI/2) + (centerx/4))
            let Y = Math.ceil(y*Math.cos(Math.PI/2) + x*Math.sin(Math.PI/2) + (centery/4))
            newPosition.push([X,Y])
        }
        return newPosition
    }
  
  
    /* 
    //全ての関数が描くのに関係している
  
    //positionをcopyFieldに反映させる
    //updatecopyfiledで代用できるかも
    function startCopyField(copyField, position){
        for (let i = 0; i < position.length(); i++){
            let x = position[i][0]
            let y = position[i][1]
            copyField[y][x] = 1
        }
        return copyField
    }
    //startdopyfielddrow()
    //最初のだけ描く
    function startcopyfileddrow(copyField){
  
    }
  
    */
  
    //消して描いて消して描いてを考える
    //最初の描く部分は考えていない
    function updateCopyField(copyField, newposition, randomNumber){
        //newpositionをcopyFieldに反映させる
  
        for (let i = 0; i < newposition.length; i++){
            let x = newposition[i][0]
            let y = newposition[i][1]
            copyField[y][x] = 2 + randomNumber//テトリミノの種類によって数字を変えれば色も変えれるかも
        }
        //
  
  
  
    }
        //copyfileddrow()
        //1のところは消す
        //固定のブロックは2にしておく
        //描くときについでに1は0にできるかも
    function copyfielddrow(copyField){
        const red = '#ff0000'
        const grey = '#CCCCCC' 
  
        for (let y = 0; y < copyField.length; y++){
            for (let x = 0; x < copyField[0].length; x++){
                if (copyField[y][x] >= 2){//2以上にするとテトリミノの種類に応じて色変更ができるかも．hashmapを用いれば
                    draw(x, y, color[copyField[y][x]-2])
                    if (copyField[y][x] == 7){
                        copyField[y][x] = 0
                    }
  
                }
                else if(copyField[y][x] <= 1){
                    copyField[y][x] = 0
                    draw(x, y, grey)
                }
            }
        }
    }
  
    //分岐によって色指定をしたいがうまくいかないので描く部分だけ関数にする
    function draw(x, y, color){
        context.fillStyle = color
        const cellSize = 20;
        context.fillRect(x*cellSize, y*cellSize, cellSize, cellSize)
    }
  
  //描く関数をまとめてみる
    function alldrow(copyField, position,randomNumber, field){
        //console.log('beforposition: ', position)
        expectcopyfield(field, position, copyField)
        updateCopyField(copyField, position, randomNumber)
        //console.log('aftercopyfield: ', copyField)
        copyfielddrow(copyField)
        //block(field, copyfield, position)
  
    }
    //一番下まで行ける関数
    function expectation(field, position){
        let i = 0
        while (true){
  
            let expectposition = []
            for (let j = 0; j < position.length;j++){
                let x = position[j][0] 
                let y = position[j][1] + i
                expectposition.push([x, y])
            }
            if (underjudge(field, expectposition)){
                
                return expectposition
            }
            i++
        }
    }
  
    //着地地点を描く関数引数今のposition, field
    function expectcopyfield(field, position, copyField){
        let exposition = expectation(field, position)
        for (let i = 0; i < exposition.length; i++){
            let x = exposition[i][0]
            let y = exposition[i][1]
            copyField[y][x] = 7
        }
    }
  
  
  
  
    //最初の地点
   
  // mainCanvasの呼び出し
  const mainCanvas = document.getElementById('tetrisCanvas');
  
  // ↓canvasで2次元描画をするために必要らしい
  const context = mainCanvas.getContext('2d');
  // グレーの背景を塗りつぶす
  context.fillStyle = gray; // グレー色
  context.fillRect(0, 0, mainCanvas.width, mainCanvas.height);
  
  
  // miniCanvasの呼び出し
  const miniCanvas = document.getElementById('miniCanvas');
  const miniContext = miniCanvas.getContext('2d');
    /* 0~4のランダムな整数を取得して、
     ランダムなテトリミノを１つ取得 */
    let randomNumber = Math.floor(Math.random() * 5);
     
  
  
  
  function miniGetxy(tetrimino){
    const twidth = 4
    const theight = 4
    let position = []
    for (let y = 0; y < twidth; y++) {
        for (let x = 0; x < theight; x++) {
            if (tetrimino[y][x] == 1){
                position.push([x, y+1])
            }
        }
    }
    return position
  } 
  
      // 次のテトリミノの呼び出し
  
    function nextTetrimino(){
        miniContext.fillStyle = '#CCCCCC'; // グレー色
        miniContext.fillRect(0, 0, miniCanvas.width, miniCanvas.height);
  
    
        // 次のテトリミノの呼び出し
        let nextRandomNumber = Math.floor(Math.random() * 5);
        let nextTetriminoPattern = tetrimino(nextRandomNumber);
        // テトリミノのminiCanvas内での位置を取得
        let nextPosition;
        nextPosition = miniGetxy(nextTetriminoPattern);
        
        // miniCanvasに描画
        const cellSize = 20
        for (let i = 0; i < nextPosition.length; i++) {
        let x = nextPosition[i][0]
        let y = nextPosition[i][1]
        miniContext.fillStyle = color[nextRandomNumber]
        miniContext.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
        return [nextTetriminoPattern,nextRandomNumber]
    }
    nextlist = nextTetrimino()
    next = nextlist[0]
    nextRandomNumber = nextlist[1]
  
    function mainTetrimino(randomnum,copyField, point, field){
                // テトリミノの初期位置を取得
                /* 0~4のランダムな整数を取得して、
            ランダムなテトリミノを１つ取得 */
  
  
        let tetriminoPattern = tetrimino(randomnum);
        console.log('randomtetorimino', randomnum)
  
        position = getxy(tetriminoPattern);
        console.log('position: ', position)
        if (gameover(position,field)){
              // ゲームオーバーの処理
              deletloop(createloop())
              playerpoint = score(point - 10);
              winningMessageTextElement.innerText = `Score: ${playerpoint}`;
              winningMessageElement.classList.add('show');
              restartButton.addEventListener('click', function(){location.reload()});
              return 'gameover'
        }
        else{
            console.log('maintetalldrow')
            alldrow(copyField, position, randomnum, field)
  
            return position
        }
  
    }
    //function keyindex(field, position, copyField) {}
        
    const hashmap = {
        ArrowRight: () => right(position),
        ArrowLeft: () => left(position),
        ArrowUp: () => rotate(position),
        ArrowDown: () => under(field, position, copyField),
        " ": () => expectation(field, position) //spacekeyで一番下に落下
    };
    document.addEventListener("keydown", function (event) {
        // key プロパティによってどのキーが押されたかを調べます。
        // code プロパティを使うと大文字/小文字が区別されます。
        // 何かキーボードの押して、コンソールに出力されているか確かめましょう。
        if (hashmap[event.key]) {
            for (let i = 0; i < position.length; i++){
                let x = position[i][0]
                let y = position[i][1]
                copyField[y][x] = 1
  
            }
  
            position = hashmap[event.key]();
            console.log('key操作field: ', field)
            console.log('key操作copyfield: ',copyField)
            alldrow(copyField, position,randomNumber, field)
            for(let i = 0; i < position.length; i++){
                //下にブロックがあったら
                //着地
                if (underjudge(field, [[position[i][0],position[i][1]]])){
                    console.log('着地')
                    for (let i = 0; i < position.length; i++){
                        let x = position[i][0]
                        let y = position[i][1]
                        field[y][x] = 1
                        copyField[y][x] = randomNumber + 2
                    }
                    //次のテトリミノ
                    disapper(copyField, point);
                    point = disapper(field, point);
                    randomNumber = nextRandomNumber
        
                    // 次のテトリミノをセットし、ループを再開
                    nextlist = nextTetrimino();
                    next = nextlist[0]
                    nextRandomNumber = nextlist[1]
                    position = mainTetrimino(randomNumber, copyField, point, field)
                    if (position == 'gameover'){
                        // ゲームオーバーの処理
                        deletloop(createloop())
                        playerpoint = score(point - 10);
                        winningMessageTextElement.innerText = `Score: ${playerpoint}`;
                        winningMessageElement.classList.add('show');
                        restartButton.addEventListener('click', function(){location.reload()});
                        return;
                  }
  
                    
                }
                
            }
        }
        return position
    });
  
    //点数を保存
    function score(point){
        point += 10
        scoreDisplay.innerHTML = point
        return point
    }
  
  
    //ゲームオーバー判定
    function gameover(position,field){
        for (let i = 0; i < position.length; i++){
            let x = position[i][0]
            let y = position[i][1]
            if (field[y][x] == 1){
                return true
            }
        }
        return false
    }
  
    //loop生み出す関数
    function createloop(){
        let loop = setTimeout(autodown, speed)
        return loop
    }
    //loop削除関数
    function deletloop(loop){
        clearTimeout(loop,speed);
    }
    
    function autodown() {
        if (!isPaused){
            createloop()
  
            position = under(field, position,copyField);
            alldrow(copyField, position,randomNumber, field)        
            for(let i = 0; i < position.length; i++){
                //下にブロックがあったら
                //着地
                if (underjudge(field, [[position[i][0],position[i][1]]])){
                    console.log('着地')
                    for (let i = 0; i < position.length; i++){
                        let x = position[i][0]
                        let y = position[i][1]
                        field[y][x] = 1
                        copyField[y][x] = randomNumber + 2
                    }
                    randomNumber = nextRandomNumber
                    //次のテトリミノ
                    disapper(copyField, point);
                    point = disapper(field, point);
        
                    // 次のテトリミノをセットし、ループを再開
                    nextlist = nextTetrimino();
                    next = nextlist[0]
                    nextRandomNumber = nextlist[1]
                    position = mainTetrimino(randomNumber, copyField, point, field)
                    if (position == 'gameover'){
                        // ゲームオーバーの処理
                        deletloop(createloop())
                        playerpoint = score(point - 10);
                        winningMessageTextElement.innerText = `Score: ${playerpoint}`;
                        winningMessageElement.classList.add('show');
                        restartButton.addEventListener('click', function(){location.reload()});
                        return;
                    }
                    
                    
                }
                
            }
  
        }
  
  
  
  
        
    }
  
    const winningMessageElement = document.getElementById('winningMessage');
    const winningMessageTextElement = document.querySelector('[data-winning-message-text');
    const restartButton = document.getElementById('restartButton');
  
    const startButton = document.getElementById('start-button');
    let isPaused = false;
  
  
    startButton.addEventListener('click', function() {
      if (!isPaused) {
        deletloop(createloop());
        startButton.innerText = 'Restart';
      } else {
        autodown();
        startButton.innerText = 'Pause';
      }
      isPaused = !isPaused;
    });
  
    
  
  //メイン関数
    function main() {
  
        
        mainTetrimino(randomNumber, copyField, point, field);//最初のテトリミノ
  
        console.log(position)
        autodown()
  
    }
    main()
  
  });
  
  /*
  新しいテトリミノを生み出す
  randomNum
  tetriminopatern
  getxy
  gameover
  alldrow
  
  
  
  キー操作
  自動落下
  着地（under）
    次のテトリミノ
    randomNum = nextRandomNum
  
  
  
  */
  
    /*
    ホールド機能
    入れ替えるとき回転関数で用いた真ん中の座標を使う？
    ホールドボタンが押される
    テトリミノの番号を記憶
    テトリミノの中心座標を取得
    ホールドされているテトリミノの番号を取得
    ホールド側
    グレーで塗る
    テトリミノを番号を用いて表示
    Main側
    取得した中心座標とホールド手捕り物番号を用いて表示
    */
  
    /*
    setintervalを関数にする引数無し
    例
    function interval(){
        setinterval( 300)kiさんに書き方を聞く
    }
    gameoverの処理や一列が消えるなどの処理はここに書く
    underのunderjudgeのところでsetinterval関数を呼び出す
    引数としてnextなどを送りたいから遅れる関数をつくる
    例
    function sent(){
        nextlist = nextTetrimino();
        next = nextlist[0]
        nextRandomNumber = nextlist[1]
    }
    underの中でsentとintervalを呼ぶ
    */
  