(function(){

var defConst = function(obj,prop,val){
 Object.defineProperty(obj,prop,{
  "value": val
 });
};

defConst(window,      "_libs", {});
defConst(window._libs,"depend",{});

var libObj = window._libs.depend;

defConst(libObj,"codez",{});
defConst(libObj,"loaded",[]);
defConst(libObj,"pending",[]);
defConst(libObj,"required",{});
defConst(libObj,"sources",{});
defConst(libObj,"return",{});

var run = function(id){
 var thisObj = {};
 var index;
 libObj.return[id] = libObj.codez[id].call(thisObj);
 index=libObj.pending.indexOf(id)
 if(index+1){
  libObj.pending.splice(index,1);
  libObj.loaded.push(id);
 }
 defConst(window._libs,id,thisObj);
 
 var i;
 for(req_id in libObj.required){
  i = -1;
  index = libObj.required[req_id].indexOf(id);
  if(index+1){
   libObj.required[req_id].splice(index,1);
   if(libObj.required[req_id].length==0){
    run(req_id);
   }
  }
 }
};

var load = function(id,req,f,isLib){
 id=id+"";
 if(!id){throw InternalError("No id provided");}
 if(typeof req == "function"){
  f = req;
  req = [];
 }
 req = [].concat(req);
 if(typeof f != "function"){
  throw InternalError("No function provided");
 }
 
 
 if(!(libObj.pending.indexOf(id)+1)&&isLib){
  libObj.pending.push(id);
 }
 libObj.codez[id] = f;
 
 libObj.required[id] = [];
 var i = -1;
 var node;
 while(++i<req.length){
  if(!(libObj.loaded.indexOf(req[i])+1)){
   libObj.required[id].push(req[i]);
   if(!(libObj.pending.indexOf(req[i])+1)){
    libObj.pending.push(req[i]);
    node = document.createElement("script");
    node.setAttribute("src",libObj.sources[req[i]] ||"./"+req[i]+".js");
    node.setAttribute("async","");
    node.setAttribute("data-sudden-death","");
    node.addEventListener("load",
     function(e){e.target.parentNode.removeChild(e.target);}
    );
    document.head.appendChild(node);
   }
  }
 }
 
 if(libObj.required[id].length==0){run(id);}
};

window.Library = function(id,req,f){
 load(id,req,f,true);
}

window.Script = function(id,req,f){
 load(id,req,f,false);
};

})();