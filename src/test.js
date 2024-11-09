const  Qualification="cxcxcx"
const startYear="dsdsd"
const endYear="     "

if([Qualification,startYear,endYear].some((value)=>value.trim()==""))
{
    console.log("I am true")
}
const selectedyear="2019"
const currentyear=new Date().getFullYear()
console.log(currentyear -selectedyear)