const express = require('express');
const ExpressError = require('./expressError')

const app = express();

function verifyArgs(nums){
    console.log(nums[0])
    if(!nums[0]){
        console.log("enter some input!!!")
        throw new ExpressError("Bad Request: Please enter valid numbers", 400)
    }
    const arr = nums.split(",")
    for (input of arr){
        if(!parseFloat(input)){
            console.log("thats not a num!!!!")
            throw new ExpressError(`Bad Request: ${input} is not a valid number`, 400)
        }
    }
    return arr;
}

app.get('/mean', (req,res, next)=>{
    let nums = req.query.nums;
    debugger
    try{
        if(!nums){
            console.log("enter some input!!!")
            const e = new ExpressError("Bad Request: Please enter valid numbers", 400)
            console.log(e.msg)
            next(e)
        }
        const arr = nums.split(",")
        for (input of arr){
            if(!parseFloat(input)){
                console.log("thats not a num!!!!")
                const e = new ExpressError(`Bad Request: ${input} is not a valid number`, 400)
                next(e)
            }
        }
        console.log("is this thing still on?")
        let numArr = arr.map(x => parseFloat(x))
        const sum = numArr.reduce((total,num) => total + num, 0)
        const mean = sum / numArr.length
        return res.send({"operation": "mean", "value": mean})
    } 
    catch(e){
        next(e);
    }
})

app.get('/median', (req,res,next)=>{
    let nums;
    try{
        nums = verifyArgs(req.query.nums);
    } 
    catch(e){
        next(e);
    }

    let numArr = nums.map(x => parseFloat(x))
    numArr.sort((x,y)=> x > y ? 1 : -1)
    if(numArr.length % 2 == 1){
        const medianIndex = Math.floor(numArr.length/2);
        const median = numArr[medianIndex];
        return res.json({"operation": "median", "value": median})
    } else{
        const lowerMedianIndex = Math.floor(numArr.length/2) - 1;
        const higherMedianIndex = Math.floor(numArr.length/2);
        const median = (numArr[lowerMedianIndex] + numArr[higherMedianIndex])/2;
        return res.json({"operation": "median", "value": median})
    }
})

app.get('/mode', (req,res,next)=>{
    let nums;
    try{
        nums = verifyArgs(req.query.nums);
    } 
    catch(e){
        return next(e);
    }
    let numArr = nums.map(x => parseFloat(x))
    let obj = {};
    numArr.forEach((val,idx) => {
        if(!obj[val]){
            obj[val] = 1;
        }
        else{
            obj[val] += 1;
        }
    })
    
    let modeCount = 0;
    let mode;
    for(const num in obj){
        if(obj[num] >= modeCount){
            modeCount = obj[num]
            mode = num;
        }
    }
    return res.json({"operation": "mode", "value": mode})
})

// If no other route matches, respond with a 404
app.use((req, res, next) => {
    const e = new ExpressError("Page Not Found", 404)
    next(e)
})
  
  
// Error handler
app.use(function (err, req, res, next) { //Note the 4 parameters!
    // the default status is 500 Internal Server Error
    console.log(err)
    let status = err.status || 500;
    let message = err.msg;

    // set the status and alert the user
    return res.status(status).json({
        error: { message, status }
    });
});

app.listen(3000, function () {
  console.log('App on port 3000');
})