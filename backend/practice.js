function fact(num){
let newnum=1
for(let i=1; i<=num ; i++){
    
    newnum = num*i
}
return newnum;
}

console.log(fact(5))