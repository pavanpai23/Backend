const fs = require("fs");
const os=require("os");

// console.log(os.cpus().length);//t know tread pool 

//synchoronus
// fs.writeFileSync("./test.txt", "Hello");

//asynchoronus
// fs.writeFile("./test.txt", "Hello World", (err)=>{});

//read file

//synch
// const result=fs.readFileSync('./read.txt',"utf-8");
// console.log(result);

//asyncho
// fs.readFile('./read.txt',"utf-8",(err,result)=>{
//     if(err){
//         console.log('Error',err);
//         }
//         else{
//             console.log(result);

//         }
// })

// diff b/w syncho and asynco is
// in syncho there is no call back is required and error is also not passed but in async both must be passed

// fs.appendFileSync("./test.txt",`${Date} Hey there`);

//Blocking and Non-Blocking

// console.log("5");
// //Blocking
// const res = fs.readFileSync("./test.txt", "utf-8");
// console.log(res);

// console.log("8");

//non_blocking
// console.log("5");

// fs.readFile("./test.txt", "utf-8", (err, result) => {
//   console.log(result);
// });

// console.log("8");
