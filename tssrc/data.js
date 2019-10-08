export function string2Hex(str) {
    if(str === "")
        return "";
    var hexCharCode = [];  
    for(var i = 0; i < str.length; i++) {
        hexCharCode.push((str.charCodeAt(i)).toString(16));
    }
    return hexCharCode.join("");
}