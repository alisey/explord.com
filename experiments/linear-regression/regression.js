function quadraticCost(a,b){for(var e,c=0,d=0;e=a[d++];)c+=Math.pow(b(e[0])-e[1],2);return c/2/a.length}function linearFunction(a){return function(b){return a[0]+a[1]*b}}function gradientDescentIteration(a,b,c){for(var d=b[0],e=b[1],f=a.length,g=0,h=0,i=0;f>i;i++){var j=a[i][0],k=a[i][1];g+=d+e*j-k,h+=(d+e*j-k)*j}return[d-c*g/f,e-c*h/f]}