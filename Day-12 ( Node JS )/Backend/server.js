const http=require("http");

//dummy data
var data={
    name:"gaurav",
    friend:"risabh",
    age:21
}

//server create
http.createServer((request,response)=>{
    //1. first parameter will always work as request
    //2. second parameter will always work as response

    //create api here
    if(request.url==="/hit" && request.method==="GET"){
        data=JSON.stringify(data);
        response.writeHead(200,{
            'content-type':'application/json',
            'Access-Control-Allow-Origin':'*'
        })

        //send response from here
        response.write(data);
        response.end();
    }
    
}).listen(8081,()=>{
    console.log("Server has started");
})