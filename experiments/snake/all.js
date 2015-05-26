function randomChoice(a){return a[0|Math.random()*a.length]}function World(a){this.size=a,this.snake=[],this.growth=0,this.apple=null}function Brain(a){return ShortestPathPlanner(a)}function RandomMovePlanner(a){return{suggestMove:function(b){b(randomChoice(a.validMoves())||null)}}}function ShortestPathPlanner(a){return{suggestMove:function(b){shortestPathMove(a,function(c){view.slowmo(!c),b(c||a.validMoves().shift())})}}}function shortestPathMove(a,b){function q(b,c){for(var d=null,f=null,g=a.neighbors(b),h=0;g.length>h;h++){var i=g[h],j=e[i]+(i-b==c?0:.5);j>=0&&(null===f?(f=j,d=i):f>j&&(f=j,d=i))}return d}forceField.clear();for(var c=a.snake[0],d=c-a.snake[1],e=[],f=a.snake.length,g=1;(a.growth?f:f-1)>g;g++)e[a.snake[g]]=-1;var h=[a.apple],i=0;a:for(;h.length;){var j=h;h=[];for(var g=0;j.length>g;g++){var k=j[g];if(void 0===e[k]){e[k]=i;var l=a.neighbors(k);if(forceField.isOn()){for(var m=[],n=0;l.length>n;n++){var o=l[n];e[o]>=0&&m.push(o-k)}if(m.length){var p=function(a,b){return function(){forceField.setDirection(a,b)}}(k,m);a.ateApple?setTimeout(p,60*i):p()}}if(k==c)break a;h=h.concat(l)}}i+=1}cur=c;for(var s,r=[];null!==cur&&0!==e[cur];){var s=q(cur,d);if(null===s)break;r.push(s),d=s-cur,cur=s}if(move=r.length?r[0]-c:null,a.ateApple&&forceField.isOn())setTimeout(function(){for(var a=0;r.length-1>a;a++)forceField.highlight(r[a]);b(move)},60*i);else{for(var g=0;r.length-1>g;g++)forceField.highlight(r[g]);b(move)}}function SnakeView(a,b){function d(a,d){a=a||d;for(var f=e([-a[0],-a[1]],d,c),g=0;f.length>g;g++)f[g][0]=(b*f[g][0]+b)/2,f[g][1]=(b*f[g][1]+b)/2;return f}function e(a,b,c){for(var d=[],e=b[0]-a[0],f=b[1]-a[1],g=0;c>g;g++)if(e&&f){var h=b[0]==-a[1]&&b[1]==a[0]?-1:1,i=Math.atan2(b[1],b[0])+h*g/c*Math.PI/2;d.push([(a[0]||b[0])-Math.cos(i),(a[1]||b[1])-Math.sin(i)])}else d.push([a[0]+e*g/c,a[1]+f*g/c]);return d}function f(a){for(var c=0,e=0,f=[],g=0;a.length>g;g++){for(var h=d(a[g-1],a[g],a[g+1]),i=0;h.length>i;i++)f.push([c+h[i][0],e+h[i][1]]);c+=a[g][0]*b,e+=a[g][1]*b}return f}function g(a,b){i.save(),i.lineCap="round",i.lineWidth=12,i.strokeStyle="#000",i.globalAlpha=.2,i.translate(b[0]+2,b[1]+2),i.beginPath(),i.moveTo(a[0][0],a[0][1]);for(var c=1;a.length>c;c++)i.lineTo(a[c][0],a[c][1]);i.stroke(),i.restore(),i.save(),i.lineCap="round",i.lineWidth=12,i.strokeStyle="#000",i.globalAlpha=.4,i.translate(b[0]+1,b[1]+1),i.beginPath(),i.moveTo(a[0][0],a[0][1]);for(var c=1;a.length>c;c++)i.lineTo(a[c][0],a[c][1]);i.stroke(),i.restore(),i.save(),i.lineCap="round",i.lineWidth=12,i.strokeStyle="#000",i.translate(b[0],b[1]),i.beginPath(),i.moveTo(a[0][0],a[0][1]);for(var c=1;a.length>c;c++)i.lineTo(a[c][0],a[c][1]);i.stroke(),i.restore(),i.save(),i.translate(b[0],b[1]);for(var c=1;a.length-1>c;c++)if(!(c%3)){var d=Math.atan2(a[c+1][1]-a[c-1][1],a[c+1][0]-a[c-1][0]);i.beginPath(),c%6?(i.fillStyle="#fc0",i.arc(a[c][0]+4*Math.sin(d),a[c][1]-4*Math.cos(d),2,0,2*Math.PI),i.arc(a[c][0]-4*Math.sin(d),a[c][1]+4*Math.cos(d),2,0,2*Math.PI)):(i.fillStyle="#eee",i.arc(a[c][0],a[c][1],2,0,2*Math.PI)),i.fill()}i.restore()}function h(a,d){for(var e=[],h=1;this.snake.length>h;h++){var i=this.snake[h][0]-this.snake[h-1][0],j=this.snake[h][1]-this.snake[h-1][1];e.push([i,j])}var k=f(e),l=Math.floor(c/2)+c-a;k=k.slice(l,l+(this.snake.length-3)*c),d&&(k=k.slice(0,k.length-c+a+1)),g(k,[this.snake[0][0]*b,this.snake[0][1]*b])}var c=5,i=a.getContext("2d");return this.snake=[],{redraw:h,stepsPerSquare:c}}function Betty(a,b){function f(a,b,d){for(var e=[[a,b]],f=0;d.length>f;f++)a-=d[f][0],b-=d[f][1],e.push([a,b]);e.push(e[e.length-1]),c.snake=e}var c=new SnakeView(a,b),d=4,e=0;return{go:function(a,b){d=0,e=b,c.snake.unshift([c.snake[0][0]+a[0],c.snake[0][1]+a[1]]),b||c.snake.pop()},tick:function(){return 4>d?(d+=1,!0):!1},render:function(){c.redraw(d,e)},setSegments:f}}function SnakeWorldView(a){function m(){j.clearRect(0,0,g.width,g.height),k.render()}function n(){f=setTimeout(n,function(){return e?2*c:d?2:16}()),l||(k.tick()?m():(l=!0,a.onStepCompletion(function(a,b){l=!1,a&&(k.go(a,b),m())})))}function p(a){i&&a[0]==i[0]&&a[1]==i[1]||(i=a,h.style.webkitAnimation="none",h.style.animation="none",h.style.display="none",setTimeout(function(){h.style.webkitAnimation="",h.style.animation="",h.style.display=""})),h.style.left=a[0]*b+"px",h.style.top=a[1]*b+"px"}var f,b=15,c=16,d=!1,e=!1,g=document.createElement("canvas");g.style.position="absolute";var h=document.createElement("div");h.className="apple",h.style.position="absolute",h.style.background="url(target.png) no-repeat",h.style.width="28px",h.style.height="28px",h.style.marginLeft="-6px",h.style.marginTop="-6px",h.style.display="none";var i=null,j=g.getContext("2d"),k=new Betty(g,b),l=!1;return k.setSegments(a.snake[0],a.snake[1],a.snake[2]),g.width=a.width*b,g.height=a.height*b,a.container.appendChild(h),a.container.appendChild(g),a.container.style.width=a.width*b+"px",a.container.style.height=a.height*b+"px",a.container.style.position="relative",setTimeout(n,c),m(),p(a.apple),{placeApple:p,fastmo:function(a){d=a},slowmo:function(a){e=a},destroy:function(){clearTimeout(f),g.parentNode.removeChild(g),h.parentNode.removeChild(h)}}}function ForceField(a,b,c,d){var e=document.createElement("div"),f=[];e.className="force-field",e.style.width=c*b+"px",e.style.height=d*b+"px",e.style.position="absolute";for(var g=0;c*d>g;g++){var h=document.createElement("div");h.style.width=b+"px",h.style.height=b+"px",h.innerHTML="",e.appendChild(h),f.push(h)}a.appendChild(e);var i=!0,j=!0;return{clear:function(){if(!j){j=!0;for(var a=0;f.length>a;a++)f[a].style.opacity=0}},setDirection:function(a,b){if(i){j=!1,bg=[];for(var c=0;b.length>c;c++)dir=b[c],-1==dir?dir="left":1==dir?dir="right":0>dir?dir="up":dir>0&&(dir="down"),bg.push("url(arrow-"+dir+".png)"),f[a].style.background=bg.join(","),f[a].style.opacity=.4}},highlight:function(a){i&&(f[a].style.opacity=1)},toggle:function(a){i=a},isOn:function(){return i},destroy:function(){a.removeChild(e)}}}World.prototype.placeObjects=function(){for(var a=0|this.size*(this.size-1)/2,b=0;5>b;b++)this.snake.push(a+this.size*b);this.relocateApple()},World.prototype.id=function(){return this.snake[0]},World.prototype.relocateApple=function(){for(var a=[],b=0;this.size*this.size>b;b++)-1==this.snake.indexOf(b)&&a.push(b);this.apple=randomChoice(a)},World.prototype.clone=function(){var a=new World;return a.size=this.size,a.snake=this.snake.slice(),a.growth=this.growth,a.apple=this.apple,a.ateApple=this.ateApple,a},World.prototype.move=function(a){this.ateApple=!1,a&&(this.growth?this.growth--:this.snake.pop(),this.snake.unshift(this.snake[0]+a),this.snake[0]==this.apple&&(this.ateApple=!0,this.growth+=1,this.relocateApple()))},World.prototype.validMoves=function(){for(var a=this.snake[0],b=this.snake[this.snake.length-1],c=this.neighbors(a),d=[],e=0;c.length>e;e++){var f=c[e];(f==b&&!this.growth||-1==this.snake.indexOf(f))&&d.push(f-a)}return d},World.prototype.neighbors=function(a){var b=[],c=this.cellX(a),d=this.cellY(a),e=this.size;return c>0&&b.push(a-1),e-1>c&&b.push(a+1),d>0&&b.push(a-e),e-1>d&&b.push(a+e),b};var UP=[0,-1],DOWN=[0,1],RIGHT=[1,0],LEFT=[-1,0];World.prototype.cellCoords=function(a){return[this.cellX(a),this.cellY(a)]},World.prototype.cellX=function(a){return a%this.size},World.prototype.cellY=function(a){return 0|a/this.size},World.prototype.appleCoords=function(){return this.cellCoords(this.apple)},World.prototype.direction=function(a){return 1==a?RIGHT:-1==a?LEFT:a>0?DOWN:UP},World.prototype.snakeAsDirections=function(){for(var a=[],b=1;this.snake.length>b;b++)a.push(this.direction(this.snake[b-1]-this.snake[b]));return a.unshift(a[0]),this.cellCoords(this.snake[0]).concat([a])};